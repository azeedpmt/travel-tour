import { useState } from 'react';
import { paymentService } from '../../services/paymentService';
import { bookingService } from '../../services/bookingService';
import toast from 'react-hot-toast';
import { FiCreditCard, FiLock, FiCheck } from 'react-icons/fi';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  amount: number;
  onSuccess: () => void;
}

const PaymentModal = ({ isOpen, onClose, bookingId, amount, onSuccess }: PaymentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe'>('razorpay');

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      // Create Razorpay order
      const orderResponse = await paymentService.createRazorpayOrder(amount, bookingId);
      
      if (!orderResponse.success) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: orderResponse.data.key,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: import.meta.env.VITE_APP_NAME,
        order_id: orderResponse.data.orderId,
        description: `Booking Payment for ${bookingId}`,
        handler: async (response: any) => {
          // Verify payment
          const verifyResponse = await paymentService.verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId: bookingId,
          });

          if (verifyResponse.success) {
            // Update booking payment status
            await bookingService.updatePaymentStatus(bookingId, 'completed', response.razorpay_payment_id);
            toast.success('Payment successful!');
            onSuccess();
          } else {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(error.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const intentResponse = await paymentService.createStripeIntent(amount, bookingId);
      
      if (!intentResponse.success) {
        throw new Error('Failed to create payment intent');
      }

      // For Stripe, you would integrate Stripe Elements here
      // This is a simplified version - you'd need to implement Stripe.js
      toast.info('Stripe integration - Please implement Stripe Elements');
      
      // After successful payment confirmation
      const confirmResponse = await paymentService.confirmStripePayment(
        intentResponse.data.paymentIntentId,
        bookingId
      );
      
      if (confirmResponse.success) {
        await bookingService.updatePaymentStatus(bookingId, 'completed', intentResponse.data.paymentIntentId);
        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      handleStripePayment();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Booking ID:</span>
            <span className="font-mono text-sm">{bookingId.slice(-8)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">₹{amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('razorpay')}
              className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition ${
                paymentMethod === 'razorpay'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <FiCreditCard className="w-5 h-5" />
              <span>Razorpay</span>
              {paymentMethod === 'razorpay' && <FiCheck className="w-4 h-4 text-blue-600" />}
            </button>
            <button
              onClick={() => setPaymentMethod('stripe')}
              className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition ${
                paymentMethod === 'stripe'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <FiCreditCard className="w-5 h-5" />
              <span>Stripe</span>
              {paymentMethod === 'stripe' && <FiCheck className="w-4 h-4 text-blue-600" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <span className="flex items-center">
            <FiLock className="w-3 h-3 mr-1" />
            Secure Payment
          </span>
          <span>Powered by {paymentMethod === 'razorpay' ? 'Razorpay' : 'Stripe'}</span>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          By completing this payment, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;