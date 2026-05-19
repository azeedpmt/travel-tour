// // import { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { dealService } from '../../services/dealService';
// // import { hotelService } from '../../services/hotelService';
// // import type { Deal, Hotel } from '../../types';
// // import BookingForm from '../../components/user/BookingForm';
// // import PaymentModal from '../../components/user/PaymentModal';
// // import LoadingSpinner from '../../components/common/LoadingSpinner';
// // import { useAppData } from '../../contexts/AppContext';
// // const BookingPage = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const { isAuth } = useAppData();
// //   const [deal, setDeal] = useState<Deal | null>(null);
// //   const [hotel, setHotel] = useState<Hotel | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [showPayment, setShowPayment] = useState(false);
// //   const [bookingId, setBookingId] = useState('');
// //   const [totalAmount, setTotalAmount] = useState(0);

// //   useEffect(() => {
// //     if (!isAuth) {
// //       navigate('/login');
// //       return;
// //     }
// //     fetchDeal();
// //   }, [id, isAuth]);

// //   const fetchDeal = async () => {
// //     if (!id) return;
// //     try {
// //       const response = await dealService.getDealById(id);
// //       if (response.success) {
// //         setDeal(response.data);
// //         const hotelRes = await hotelService.getHotelById(response.data.hotelId._id);
// //         if (hotelRes.success) setHotel(hotelRes.data);
// //       }
// //     } catch (error) {
// //       console.error('Failed to fetch deal:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleBookingSuccess = (newBookingId: string, amount: number) => {
// //     setBookingId(newBookingId);
// //     setTotalAmount(amount);
// //     setShowPayment(true);
// //   };

// //   const handlePaymentSuccess = () => {
// //     setShowPayment(false);
// //     navigate(`/booking-success/${bookingId}`);
// //   };

// //   if (loading) return <LoadingSpinner />;
// //   if (!deal || !hotel) return <div className="text-center py-16">Deal not found</div>;

// //   return (
// //     <div className="container mx-auto px-4 py-8 max-w-4xl">
// //       <div className="mb-6">
// //         <h1 className="text-2xl font-bold text-gray-800">Complete Your Booking</h1>
// //         <p className="text-gray-600">Fill in the details to book this amazing package</p>
// //       </div>
// //       <BookingForm deal={deal} hotel={hotel} onSuccess={handleBookingSuccess} />
// //       <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} bookingId={bookingId} amount={totalAmount} onSuccess={handlePaymentSuccess} />
// //     </div>
// //   );
// // };

// // export default BookingPage;

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { dealService } from '../../services/dealService';
// import { hotelService } from '../../services/hotelService';
// import { bookingService } from '../../services/bookingService';
// import { paymentService } from '../../services/paymentService';
// import type { Deal, Hotel, Booking } from '../../types';
// import { formatCurrency, formatDate } from '../../utils/format';
// import toast from 'react-hot-toast';
// import { FiCalendar, FiUsers, FiDollarSign, FiCheck } from 'react-icons/fi';

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// const BookingPage = () => {
//   const { dealId } = useParams<{ dealId: string }>();
//   const navigate = useNavigate();
//   const [deal, setDeal] = useState<Deal | null>(null);
//   const [hotel, setHotel] = useState<Hotel | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [bookingStep, setBookingStep] = useState(1); // 1: Details, 2: Confirmation, 3: Payment
//   const [paymentLoading, setPaymentLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     guestName: '',
//     guestEmail: '',
//     guestPhone: '',
//     checkInDate: '',
//     checkOutDate: '',
//     numberOfRooms: 1,
//     numberOfGuests: 1,
//     specialRequests: '',
//   });

//   const [booking, setBooking] = useState<Booking | null>(null);

//   useEffect(() => {
//     fetchDealData();
//   }, [dealId]);

//   const fetchDealData = async () => {
//     try {
//       if (dealId) {
//         const dealResponse = await dealService.getDealById(dealId);
//         if (dealResponse.success && dealResponse.data) {
//           setDeal(dealResponse.data);
          
//           // Fetch hotel details
//           if (dealResponse.data.hotelId) {
//             const hotelResponse = await hotelService.getHotelById(dealResponse.data.hotelId._id);
//             if (hotelResponse.success && hotelResponse.data) {
//               setHotel(hotelResponse.data);
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching deal:', error);
//       toast.error('Failed to load deal details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleBooking = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate form
//     if (!formData.guestName || !formData.guestEmail || !formData.guestPhone) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     if (!formData.checkInDate || !formData.checkOutDate) {
//       toast.error('Please select check-in and check-out dates');
//       return;
//     }

//     try {
//       const bookingData = {
//         guestDetails: {
//           name: formData.guestName,
//           email: formData.guestEmail,
//           phone: formData.guestPhone,
//         },
//         hotelId: hotel?._id,
//         dealId: deal?._id,
//         checkInDate: formData.checkInDate,
//         checkOutDate: formData.checkOutDate,
//         numberOfRooms: parseInt(formData.numberOfRooms.toString()),
//         numberOfGuests: parseInt(formData.numberOfGuests.toString()),
//         specialRequests: formData.specialRequests,
//         totalAmount: deal?.discountedPrice || 0,
//       };

//       const response = await bookingService.createBooking(bookingData);
//       if (response.success && response.data) {
//         setBooking(response.data);
//         setBookingStep(2); // Move to confirmation
//       } else {
//         toast.error('Failed to create booking');
//       }
//     } catch (error) {
//       console.error('Error creating booking:', error);
//       toast.error('Failed to create booking');
//     }
//   };

//   const handlePayment = async () => {
//     if (!booking) {
//       toast.error('No booking found');
//       return;
//     }

//     setPaymentLoading(true);
//     try {
//       // Create Razorpay order
//       const orderResponse = await paymentService.createRazorpayOrder(
//         booking.totalAmount,
//         booking._id
//       );

//       if (!orderResponse.success || !orderResponse.data) {
//         toast.error('Failed to initiate payment');
//         setPaymentLoading(false);
//         return;
//       }

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: booking.totalAmount * 100, // Amount in paise
//         currency: 'INR',
//         name: 'Travel Booking',
//         description: `Booking for ${hotel?.name || 'Hotel'}`,
//         order_id: orderResponse.data.id,
//         handler: async (response: any) => {
//           try {
//             // Verify payment
//             const verifyResponse = await paymentService.verifyRazorpayPayment({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               bookingId: booking._id,
//             });

//             if (verifyResponse.success) {
//               toast.success('Payment successful!');
//               setBookingStep(3); // Move to success
              
//               // Redirect to booking confirmation after 2 seconds
//               setTimeout(() => {
//                 navigate(`/booking-confirmation/${booking._id}`);
//               }, 2000);
//             } else {
//               toast.error('Payment verification failed');
//             }
//           } catch (error) {
//             console.error('Payment verification error:', error);
//             toast.error('Payment verification failed');
//           }
//         },
//         prefill: {
//           name: formData.guestName,
//           email: formData.guestEmail,
//           contact: formData.guestPhone,
//         },
//         theme: {
//           color: '#2563eb',
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error('Payment error:', error);
//       toast.error('Failed to process payment');
//     } finally {
//       setPaymentLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading booking details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!deal || !hotel) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600 text-lg">Booking details not found</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Progress Steps */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between mb-8">
//               <div className={`flex-1 text-center ${bookingStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
//                   bookingStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
//                 }`}>
//                   1
//                 </div>
//                 <p className="text-sm font-semibold">Guest Details</p>
//               </div>
//               <div className={`flex-1 h-1 mx-4 ${bookingStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
//               <div className={`flex-1 text-center ${bookingStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
//                   bookingStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
//                 }`}>
//                   2
//                 </div>
//                 <p className="text-sm font-semibold">Confirmation</p>
//               </div>
//               <div className={`flex-1 h-1 mx-4 ${bookingStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
//               <div className={`flex-1 text-center ${bookingStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
//                   bookingStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
//                 }`}>
//                   3
//                 </div>
//                 <p className="text-sm font-semibold">Payment</p>
//               </div>
//             </div>
//           </div>

//           {/* Step 1: Guest Details */}
//           {bookingStep === 1 && (
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6">Guest Details</h2>
//               <form onSubmit={handleBooking} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
//                     <input
//                       type="text"
//                       name="guestName"
//                       value={formData.guestName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter your full name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
//                     <input
//                       type="email"
//                       name="guestEmail"
//                       value={formData.guestEmail}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter your email"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
//                     <input
//                       type="tel"
//                       name="guestPhone"
//                       value={formData.guestPhone}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter your phone number"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests *</label>
//                     <input
//                       type="number"
//                       name="numberOfGuests"
//                       value={formData.numberOfGuests}
//                       onChange={handleInputChange}
//                       min="1"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date *</label>
//                     <input
//                       type="date"
//                       name="checkInDate"
//                       value={formData.checkInDate}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date *</label>
//                     <input
//                       type="date"
//                       name="checkOutDate"
//                       value={formData.checkOutDate}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms *</label>
//                     <input
//                       type="number"
//                       name="numberOfRooms"
//                       value={formData.numberOfRooms}
//                       onChange={handleInputChange}
//                       min="1"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
//                   <textarea
//                     name="specialRequests"
//                     value={formData.specialRequests}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Any special requests or requirements?"
//                     rows={4}
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
//                 >
//                   Continue to Confirmation
//                 </button>
//               </form>
//             </div>
//           )}

//           {/* Step 2: Confirmation */}
//           {bookingStep === 2 && booking && (
//             <div className="space-y-6">
//               <div className="bg-white rounded-lg shadow p-6">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Confirmation</h2>
                
//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="font-semibold text-gray-800 mb-2">Hotel Details</h3>
//                     <p className="text-gray-600">{hotel.name}</p>
//                     <p className="text-sm text-gray-500">{hotel.city}, {hotel.state}</p>
//                   </div>

//                   <div className="border-t pt-4">
//                     <h3 className="font-semibold text-gray-800 mb-2">Guest Details</h3>
//                     <p className="text-gray-600">{formData.guestName}</p>
//                     <p className="text-gray-600">{formData.guestEmail}</p>
//                     <p className="text-gray-600">{formData.guestPhone}</p>
//                   </div>

//                   <div className="border-t pt-4">
//                     <h3 className="font-semibold text-gray-800 mb-2">Booking Details</h3>
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <span className="text-gray-500">Check-in:</span>
//                         <p className="font-medium">{formatDate(formData.checkInDate)}</p>
//                       </div>
//                       <div>
//                         <span className="text-gray-500">Check-out:</span>
//                         <p className="font-medium">{formatDate(formData.checkOutDate)}</p>
//                       </div>
//                       <div>
//                         <span className="text-gray-500">Rooms:</span>
//                         <p className="font-medium">{formData.numberOfRooms}</p>
//                       </div>
//                       <div>
//                         <span className="text-gray-500">Guests:</span>
//                         <p className="font-medium">{formData.numberOfGuests}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="border-t pt-4">
//                     <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
//                       <FiDollarSign className="w-5 h-5 mr-2" />
//                       Price Summary
//                     </h3>
//                     <div className="space-y-2">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Total Amount:</span>
//                         <span className="font-bold text-lg text-blue-600">{formatCurrency(booking.totalAmount)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-4 mt-6">
//                   <button
//                     onClick={() => setBookingStep(1)}
//                     className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition font-semibold"
//                   >
//                     Back
//                   </button>
//                   <button
//                     onClick={() => setBookingStep(3)}
//                     className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
//                   >
//                     Proceed to Payment
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Payment */}
//           {bookingStep === 3 && booking && (
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment</h2>
              
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//                 <p className="text-gray-700 mb-2">Total Amount Due:</p>
//                 <p className="text-3xl font-bold text-blue-600">{formatCurrency(booking.totalAmount)}</p>
//               </div>

//               <button
//                 onClick={handlePayment}
//                 disabled={paymentLoading}
//                 className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
//               >
//                 {paymentLoading ? 'Processing...' : 'Pay with Razorpay'}
//               </button>

//               <button
//                 onClick={() => setBookingStep(2)}
//                 className="w-full mt-4 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
//               >
//                 Back
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingPage;


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dealService } from '../../services/dealService';
import { hotelService } from '../../services/hotelService';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import type { Deal, Hotel, Booking } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import toast from 'react-hot-toast';
import { FiCalendar, FiUsers, FiDollarSign, FiCheck } from 'react-icons/fi';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BookingPage = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1); // 1: Details, 2: Confirmation, 3: Payment
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfRooms: 1,
    numberOfGuests: 1,
    specialRequests: '',
  });

  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchDealData();
  }, [dealId]);

  const fetchDealData = async () => {
    try {
      if (dealId) {
        const dealResponse = await dealService.getDealById(dealId);
        if (dealResponse.success && dealResponse.data) {
          setDeal(dealResponse.data);
          
          // Fetch hotel details
          if (dealResponse.data.hotelId) {
            const hotelResponse = await hotelService.getHotelById(dealResponse.data.hotelId._id);
            if (hotelResponse.success && hotelResponse.data) {
              setHotel(hotelResponse.data);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching deal:', error);
      toast.error('Failed to load deal details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.guestName || !formData.guestEmail || !formData.guestPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.checkInDate || !formData.checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    try {
      const bookingData = {
        guestDetails: {
          name: formData.guestName,
          email: formData.guestEmail,
          phone: formData.guestPhone,
        },
        hotelId: hotel?._id,
        dealId: deal?._id,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfRooms: parseInt(formData.numberOfRooms.toString()),
        numberOfGuests: parseInt(formData.numberOfGuests.toString()),
        specialRequests: formData.specialRequests,
        totalAmount: deal?.discountedPrice || 0,
      };

      const response = await bookingService.createBooking(bookingData);
      if (response.success && response.data) {
        setBooking(response.data);
        setBookingStep(2); // Move to confirmation
      } else {
        toast.error('Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };

  const handlePayment = async () => {
    if (!booking) {
      toast.error('No booking found');
      return;
    }

    setPaymentLoading(true);
    try {
      // Create Razorpay order
      const orderResponse = await paymentService.createRazorpayOrder(
        booking.totalAmount,
        booking._id
      );

      if (!orderResponse.success || !orderResponse.data) {
        toast.error('Failed to initiate payment');
        setPaymentLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: booking.totalAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'Travel Booking',
        description: `Booking for ${hotel?.name || 'Hotel'}`,
        order_id: orderResponse.data.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await paymentService.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });

            if (verifyResponse.success) {
              toast.success('Payment successful!');
              setBookingStep(3); // Move to success
              
              // Redirect to booking confirmation after 2 seconds
              setTimeout(() => {
                navigate(`/booking-confirmation/${booking._id}`);
              }, 2000);
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: formData.guestName,
          email: formData.guestEmail,
          contact: formData.guestPhone,
        },
        theme: {
          color: '#2563eb',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!deal || !hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Booking details not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className={`flex-1 text-center ${bookingStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  bookingStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <p className="text-sm font-semibold">Guest Details</p>
              </div>
              <div className={`flex-1 h-1 mx-4 ${bookingStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 text-center ${bookingStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  bookingStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <p className="text-sm font-semibold">Confirmation</p>
              </div>
              <div className={`flex-1 h-1 mx-4 ${bookingStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 text-center ${bookingStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  bookingStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <p className="text-sm font-semibold">Payment</p>
              </div>
            </div>
          </div>

          {/* Step 1: Guest Details */}
          {bookingStep === 1 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Guest Details</h2>
              <form onSubmit={handleBooking} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="guestName"
                      value={formData.guestName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="guestEmail"
                      value={formData.guestEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      name="guestPhone"
                      value={formData.guestPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests *</label>
                    <input
                      type="number"
                      name="numberOfGuests"
                      value={formData.numberOfGuests}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date *</label>
                    <input
                      type="date"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date *</label>
                    <input
                      type="date"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms *</label>
                    <input
                      type="number"
                      name="numberOfRooms"
                      value={formData.numberOfRooms}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special requests or requirements?"
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Continue to Confirmation
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Confirmation */}
          {bookingStep === 2 && booking && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Confirmation</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Hotel Details</h3>
                    <p className="text-gray-600">{hotel.name}</p>
                    <p className="text-sm text-gray-500">{hotel.city}, {hotel.state}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Guest Details</h3>
                    <p className="text-gray-600">{formData.guestName}</p>
                    <p className="text-gray-600">{formData.guestEmail}</p>
                    <p className="text-gray-600">{formData.guestPhone}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Booking Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Check-in:</span>
                        <p className="font-medium">{formatDate(formData.checkInDate)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Check-out:</span>
                        <p className="font-medium">{formatDate(formData.checkOutDate)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Rooms:</span>
                        <p className="font-medium">{formData.numberOfRooms}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Guests:</span>
                        <p className="font-medium">{formData.numberOfGuests}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <FiDollarSign className="w-5 h-5 mr-2" />
                      Price Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-lg text-blue-600">{formatCurrency(booking.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setBookingStep(3)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {bookingStep === 3 && booking && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-gray-700 mb-2">Total Amount Due:</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(booking.totalAmount)}</p>
              </div>

              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
              >
                {paymentLoading ? 'Processing...' : 'Pay with Razorpay'}
              </button>

              <button
                onClick={() => setBookingStep(2)}
                className="w-full mt-4 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;