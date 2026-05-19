import { Router } from 'express';
import {
    getAllDeals,
    getDealById,
    createDeal,
    updateDeal,
    deleteDeal,
    searchDeals,
    addReview,
    getFeaturedDeals,
    incrementBookings,
    getAllDestinations,
    getFeaturedDestination
} from '../controllers/deal';
import { isAuth, isAdmin } from '../middlewares/isAuth';
import { upload } from '../middlewares/upload';

const router = Router();

// Public routes
router.get('/', getAllDeals);
router.get('/featured', getFeaturedDeals);
router.get('/search', searchDeals);
router.get('/:id', getDealById);

// Protected routes (user)
router.post('/:id/reviews', isAuth, addReview);

// Protected routes (admin only)
router.post('/', isAuth, isAdmin, createDeal);
router.put('/:id', isAuth, isAdmin, updateDeal);
router.delete('/:id', isAuth, isAdmin, deleteDeal);

// Internal service route (no auth required for service-to-service)
router.put('/:id/increment-bookings', incrementBookings);


router.get('/destinations', getAllDestinations);
router.get('/destinations/featured', getFeaturedDestination);


router.post('/upload-image', isAuth, isAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ success: true, data: { url } });
});
export default router;