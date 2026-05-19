
import { Router } from 'express';
import {
    createBooking,
    getUserBookings,
    getBookingById,
    cancelBooking,
    updatePaymentStatus,
    getAllBookings,
    getHotelBookings,
    checkAvailability
} from '../controllers/booking';
import { isAuth, isAdmin } from '../middlewares/isAuth';

const router = Router();

// Public routes
router.get('/availability', checkAvailability);

// User routes
router.get('/user', isAuth, getUserBookings);
router.get('/:id', isAuth, getBookingById);
router.post('/', isAuth, createBooking);
router.put('/:id/cancel', isAuth, cancelBooking);
router.put('/:id/payment', isAuth, updatePaymentStatus);

// Admin routes
router.get('/admin/all', isAuth, isAdmin, getAllBookings);
router.get('/hotel/:hotelId', isAuth, getHotelBookings);

export default router;