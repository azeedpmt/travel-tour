import { Response } from 'express';
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import { AuthRequest } from '../middlewares/isAuth';
import { getChannel } from '../config/rabbitmq';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-02-24.acacia' as any
});

// Create Razorpay Order
export const createRazorpayOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { amount, currency = 'INR', bookingId } = req.body;
        
        if (!amount || !bookingId) {
            return res.status(400).json({ success: false, error: 'Amount and bookingId are required' });
        }
        
        // Check if Razorpay is initialized properly
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ success: false, error: 'Razorpay credentials not configured' });
        }
        
        const options = {
            amount: Math.round(amount * 100),
            currency,
            receipt: `booking_${bookingId}`,
            payment_capture: 1
        };
        
        const order = await razorpay.orders.create(options);
        
        const channel = getChannel();
        if (channel) {
            channel.sendToQueue('PAYMENT_QUEUE', Buffer.from(JSON.stringify({
                type: 'PAYMENT_INITIATED',
                bookingId,
                paymentId: order.id,
                amount,
                provider: 'razorpay',
                status: 'pending',
                timestamp: new Date()
            })));
        }
        
        res.json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                key: process.env.RAZORPAY_KEY_ID
            }
        });
    } catch (error: any) {
        console.error('Razorpay order creation failed:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to create order' });
    }
};

// Verify Razorpay Payment
export const verifyRazorpayPayment = async (req: AuthRequest, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
        
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');
        
        if (expectedSignature === razorpay_signature) {
            const channel = getChannel();
            if (channel) {
                channel.sendToQueue('PAYMENT_QUEUE', Buffer.from(JSON.stringify({
                    type: 'PAYMENT_SUCCESS',
                    bookingId,
                    paymentId: razorpay_payment_id,
                    provider: 'razorpay',
                    status: 'completed',
                    timestamp: new Date()
                })));
            }
            
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            const channel = getChannel();
            if (channel) {
                channel.sendToQueue('PAYMENT_QUEUE', Buffer.from(JSON.stringify({
                    type: 'PAYMENT_FAILED',
                    bookingId,
                    paymentId: razorpay_payment_id,
                    provider: 'razorpay',
                    status: 'failed',
                    timestamp: new Date()
                })));
            }
            
            res.status(400).json({ success: false, error: 'Invalid signature' });
        }
    } catch (error: any) {
        console.error('Razorpay verification failed:', error);
        res.status(500).json({ success: false, error: error.message || 'Verification failed' });
    }
};

// Create Stripe Payment Intent
export const createStripePaymentIntent = async (req: AuthRequest, res: Response) => {
    try {
        const { amount, currency = 'usd', bookingId } = req.body;
        
        if (!amount || !bookingId) {
            return res.status(400).json({ success: false, error: 'Amount and bookingId are required' });
        }
        
        // Check if Stripe is initialized properly
        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(500).json({ success: false, error: 'Stripe credentials not configured' });
        }
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            metadata: { bookingId }
        });
        
        const channel = getChannel();
        if (channel) {
            channel.sendToQueue('PAYMENT_QUEUE', Buffer.from(JSON.stringify({
                type: 'PAYMENT_INITIATED',
                bookingId,
                paymentId: paymentIntent.id,
                amount,
                provider: 'stripe',
                status: 'pending',
                timestamp: new Date()
            })));
        }
        
        res.json({
            success: true,
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            }
        });
    } catch (error: any) {
        console.error('Stripe payment intent failed:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to create payment intent' });
    }
};

// Confirm Stripe Payment
export const confirmStripePayment = async (req: AuthRequest, res: Response) => {
    try {
        const { paymentIntentId, bookingId } = req.body;
        
        if (!paymentIntentId || !bookingId) {
            return res.status(400).json({ success: false, error: 'PaymentIntentId and bookingId are required' });
        }
        
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string);
        
        if (paymentIntent.status === 'succeeded') {
            const channel = getChannel();
            if (channel) {
                channel.sendToQueue('PAYMENT_QUEUE', Buffer.from(JSON.stringify({
                    type: 'PAYMENT_SUCCESS',
                    bookingId,
                    paymentId: paymentIntentId,
                    provider: 'stripe',
                    status: 'completed',
                    timestamp: new Date()
                })));
            }
            
            res.json({ success: true, message: 'Payment confirmed successfully' });
        } else if (paymentIntent.status === 'requires_payment_method') {
            res.status(400).json({ success: false, error: 'Payment requires payment method' });
        } else {
            const channel = getChannel();
            if (channel) {
                channel.sendToQueue('PAYMENT_QUEUE', Buffer.from(JSON.stringify({
                    type: 'PAYMENT_FAILED',
                    bookingId,
                    paymentId: paymentIntentId,
                    provider: 'stripe',
                    status: 'failed',
                    timestamp: new Date()
                })));
            }
            
            res.status(400).json({ success: false, error: `Payment status: ${paymentIntent.status}` });
        }
    } catch (error: any) {
        console.error('Stripe payment confirmation failed:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to confirm payment' });
    }
};

// Get payment status
export const getPaymentStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { paymentId, provider } = req.params;
        
        if (!paymentId || !provider) {
            return res.status(400).json({ success: false, error: 'PaymentId and provider are required' });
        }
        
        const paymentIdStr = paymentId as string;
        let status = null;
        
        if (provider === 'razorpay') {
            const payment = await razorpay.payments.fetch(paymentIdStr);
            status = payment.status;
        } else if (provider === 'stripe') {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIdStr);
            status = paymentIntent.status;
        }
        
        res.json({ success: true, data: { paymentId: paymentIdStr, provider, status } });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to get payment status' });
    }
};

// Refund payment
export const refundPayment = async (req: AuthRequest, res: Response) => {
    try {
        const { paymentId, provider, amount } = req.body;
        
        if (!paymentId || !provider) {
            return res.status(400).json({ success: false, error: 'PaymentId and provider are required' });
        }
        
        let refund;
        
        if (provider === 'razorpay') {
            refund = await razorpay.payments.refund(paymentId as string, {
                amount: amount ? Math.round(amount * 100) : undefined
            });
        } else if (provider === 'stripe') {
            refund = await stripe.refunds.create({
                payment_intent: paymentId as string,
                amount: amount ? Math.round(amount * 100) : undefined
            });
        }
        
        const channel = getChannel();
        if (channel) {
            channel.sendToQueue('PAYMENT_QUEUE', Buffer.from(JSON.stringify({
                type: 'PAYMENT_REFUNDED',
                paymentId,
                provider,
                refundId: refund?.id,
                timestamp: new Date()
            })));
        }
        
        res.json({ success: true, data: refund });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to process refund' });
    }
};
// Webhook to handle payment success from frontend
export const paymentSuccessWebhook = async (req: AuthRequest, res: Response) => {
    try {
        const { bookingId, paymentId, provider, status } = req.body;
        
        if (!bookingId || !paymentId) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        
        const channel = getChannel();
        if (channel) {
            // Notify booking service about successful payment
            channel.sendToQueue('BOOKING_QUEUE', Buffer.from(JSON.stringify({
                type: 'PAYMENT_SUCCESS',
                bookingId,
                paymentId,
                provider,
                status: 'completed',
                timestamp: new Date()
            })));
            
            // Also send to notification queue
            channel.sendToQueue('NOTIFICATION_QUEUE', Buffer.from(JSON.stringify({
                type: 'PAYMENT_RECEIVED',
                bookingId,
                paymentId,
                provider,
                timestamp: new Date()
            })));
        }
        
        // Get frontend URL for redirect
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        
        res.json({ 
            success: true, 
            message: 'Payment recorded successfully',
            redirectUrl: `${frontendUrl}/booking/success?bookingId=${bookingId}`
        });
    } catch (error: any) {
        console.error('Payment webhook failed:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to process payment webhook' });
    }
};

// Get payment details for a booking
export const getPaymentByBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { bookingId } = req.params;
        
        // You can query your payment database here
        // For now, return a mock response
        res.json({ 
            success: true, 
            data: {
                bookingId,
                status: 'pending',
                message: 'Payment not yet processed'
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to get payment details' });
    }
};

// Initiate payment for a booking (complete flow)
export const initiateBookingPayment = async (req: AuthRequest, res: Response) => {
    try {
        const { bookingId, amount, currency = 'INR', provider = 'razorpay' } = req.body;
        
        if (!bookingId || !amount) {
            return res.status(400).json({ success: false, error: 'BookingId and amount are required' });
        }
        
        if (provider === 'razorpay') {
            // Create Razorpay order
            const options = {
                amount: Math.round(amount * 100),
                currency,
                receipt: `booking_${bookingId}`,
                payment_capture: 1,
                notes: {
                    bookingId: bookingId.toString(),
                    userId: req.userId || ''
                }
            };
            
            const order = await razorpay.orders.create(options);
            
            // Store order details (you can add to a Payment model)
            const channel = getChannel();
            if (channel) {
                channel.sendToQueue('PAYMENT_QUEUE', Buffer.from(JSON.stringify({
                    type: 'PAYMENT_INITIATED',
                    bookingId,
                    paymentId: order.id,
                    amount,
                    provider: 'razorpay',
                    status: 'pending',
                    timestamp: new Date()
                })));
            }
            
            res.json({
                success: true,
                data: {
                    provider: 'razorpay',
                    orderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    key: process.env.RAZORPAY_KEY_ID,
                    bookingId
                }
            });
        } 
        else if (provider === 'stripe') {
            // Create Stripe payment intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency,
                metadata: { bookingId: bookingId.toString() },
                receipt_email: req.body.email
            });
            
            res.json({
                success: true,
                data: {
                    provider: 'stripe',
                    clientSecret: paymentIntent.client_secret,
                    paymentIntentId: paymentIntent.id,
                    bookingId
                }
            });
        }
        else {
            res.status(400).json({ success: false, error: 'Invalid payment provider' });
        }
    } catch (error: any) {
        console.error('Initiate payment failed:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to initiate payment' });
    }
};
