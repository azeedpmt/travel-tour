import { Router } from 'express';
import {
    addHotel, getAllHotels, getHotelById, verifyHotel, updateHotelStatus,
    updateHotel, deleteHotel,
    addDeal, getAllDeals, getDealById, updateDeal, deleteDeal,
    addFoodItem, getAllFoodItems, getFoodItemById, updateFoodItem, deleteFoodItem
} from '../controllers/admin';
import { isAuth, isAdmin } from '../middlewares/isAuth';
import { getAllOfferTypes, getActiveOfferTypes, getOfferTypeBySlug,createOfferType, updateOfferType, deleteOfferType } from '../controllers/OfferType';
import { getAllHolidayStyles,getActiveHolidayStyles,   getHolidayStyleBySlug,createHolidayStyle, updateHolidayStyle, deleteHolidayStyle } from '../controllers/HolidayStyle';
import { getAllDestinations,getDestinationBySlug,createDestination,updateDestination,deleteDestination } from '../controllers/destination';

const router = Router();

// Admin routes
router.get('/offer-types', isAuth, isAdmin, getAllOfferTypes);
router.post('/offer-types', isAuth, isAdmin, createOfferType);
router.put('/offer-types/:id', isAuth, isAdmin, updateOfferType);
router.delete('/offer-types/:id', isAuth, isAdmin, deleteOfferType);

router.get('/holiday-styles', isAuth, isAdmin, getAllHolidayStyles);
router.post('/holiday-styles', isAuth, isAdmin, createHolidayStyle);
router.put('/holiday-styles/:id', isAuth, isAdmin, updateHolidayStyle);
router.delete('/holiday-styles/:id', isAuth, isAdmin, deleteHolidayStyle);

// Public routes (no auth)
router.get('/public/offer-types', getActiveOfferTypes);
router.get('/public/offer-types/slug/:slug', getOfferTypeBySlug);
router.get('/public/holiday-styles', getActiveHolidayStyles);
router.get('/public/holiday-styles/slug/:slug', getHolidayStyleBySlug);


router.post('/hotels', isAuth, isAdmin, addHotel);
router.get('/hotels', isAuth, isAdmin, getAllHotels);
router.put('/hotels/:id', isAuth, isAdmin, updateHotel);
router.delete('/hotels/:id', isAuth, isAdmin, deleteHotel);
router.get('/hotels/:id', isAuth, isAdmin, getHotelById);
router.put('/hotels/:id/verify', isAuth, isAdmin, verifyHotel);
router.patch('/hotels/:id/status', isAuth, isAdmin, updateHotelStatus);

router.post('/deals', isAuth, isAdmin, addDeal);
router.get('/deals', isAuth, isAdmin, getAllDeals);
router.get('/deals/:id', isAuth, isAdmin, getDealById);
router.put('/deals/:id', isAuth, isAdmin, updateDeal);
router.delete('/deals/:id', isAuth, isAdmin, deleteDeal);

router.post('/food', isAuth, isAdmin, addFoodItem);
router.get('/food', isAuth, isAdmin, getAllFoodItems);
router.get('/food/:id', isAuth, isAdmin, getFoodItemById);
router.put('/food/:id', isAuth, isAdmin, updateFoodItem);
router.delete('/food/:id', isAuth, isAdmin, deleteFoodItem);



// Destination routes


router.get('/destinations', isAuth, isAdmin, getAllDestinations);
// Public route – no auth required
router.get('/public/destinations', getAllDestinations);
router.get('/destinations/slug/:slug', getDestinationBySlug); // public – no auth required
router.post('/destinations', isAuth, isAdmin, createDestination);
router.put('/destinations/:id', isAuth, isAdmin, updateDestination);
router.delete('/destinations/:id', isAuth, isAdmin, deleteDestination);

export default router;