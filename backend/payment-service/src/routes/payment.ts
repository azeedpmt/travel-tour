import { Router } from 'express';
import {
    createRazorpayOrder,
    verifyRazorpayPayment,
    createStripePaymentIntent,
    confirmStripePayment,
    getPaymentStatus,
    refundPayment,
    initiateBookingPayment,
    paymentSuccessWebhook,
    getPaymentByBooking
} from '../controllers/payment';
import { isAuth } from '../middlewares/isAuth';

const router = Router();

// Complete payment flow for booking
router.post('/initiate', isAuth, initiateBookingPayment);
router.post('/success-webhook', isAuth, paymentSuccessWebhook);
router.get('/booking/:bookingId', isAuth, getPaymentByBooking);

// Razorpay routes
router.post('/razorpay/create-order', isAuth, createRazorpayOrder);
router.post('/razorpay/verify', isAuth, verifyRazorpayPayment);

// Stripe routes
router.post('/stripe/create-intent', isAuth, createStripePaymentIntent);
router.post('/stripe/confirm', isAuth, confirmStripePayment);

// Common routes
router.get('/status/:provider/:paymentId', isAuth, getPaymentStatus);
router.post('/refund', isAuth, refundPayment);

export default router;