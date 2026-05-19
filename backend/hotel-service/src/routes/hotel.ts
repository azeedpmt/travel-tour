import { Router } from 'express';
import {
    getAllHotels,
    getAllHotelsAdmin,
    getHotelById,
    createHotel,
    updateHotel,
    verifyHotel,
    searchHotels,
    getHotelsByOwner,
    getAvailableRooms,
    deleteHotel
} from '../controllers/hotel';
import { isAuth, isAdmin, isHotelOwner } from '../middlewares/isAuth';

const router = Router();

// Public routes
router.get('/', getAllHotels);
router.get('/search', searchHotels);
router.get('/:id/rooms', getAvailableRooms);
router.get('/:id', getHotelById);

// Protected routes (hotel owner)
router.get('/owner/my-hotels', isAuth, isHotelOwner, getHotelsByOwner);
router.post('/', isAuth, isHotelOwner, createHotel);
router.put('/:id', isAuth, isHotelOwner, updateHotel);

// Admin only routes
router.get('/admin/all', isAuth, isAdmin, getAllHotelsAdmin);
router.put('/:id/verify', isAuth, isAdmin, verifyHotel);
router.delete('/:id', isAuth, isAdmin, deleteHotel);

export default router;