import { Router } from 'express';
import {
    getAllFoodItems,
    getFoodItemById,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem,
    getMenuByHotel,
    searchFoodItems,
    updateAvailability,
    getPopularFoodItems,
    incrementOrders
} from '../controllers/food';
import { isAuth, isAdmin } from '../middlewares/isAuth';

const router = Router();

// Public routes
router.get('/', getAllFoodItems);
router.get('/search', searchFoodItems);
router.get('/popular', getPopularFoodItems);
router.get('/hotel/:hotelId/menu', getMenuByHotel);
router.get('/:id', getFoodItemById);

// Protected routes (admin only)
router.post('/', isAuth, isAdmin, createFoodItem);
router.put('/:id', isAuth, isAdmin, updateFoodItem);
router.put('/:id/availability', isAuth, isAdmin, updateAvailability);
router.delete('/:id', isAuth, isAdmin, deleteFoodItem);

// Internal service route
router.put('/:id/increment-orders', incrementOrders);

export default router;