import { Request, Response } from 'express';
import { Hotel } from '../models/Hotel';
import { Deal } from '../models/Deal';
import { FoodItem } from '../models/FoodItem';
import { AuthRequest } from '../middlewares/isAuth';

// ---------- HOTEL ----------
export const addHotel = async (req: AuthRequest, res: Response) => {
    try {
        const hotelData = {
            ...req.body,
            ownerId: req.body.ownerId || req.userId,   // admin’s own ID
            country: req.body.country || 'India',
            description: req.body.description || 'No description provided',
            status: 'approved',
            isVerified: true
        };
        const hotel = await Hotel.create(hotelData);
        res.status(201).json({ success: true, data: hotel });
    } catch (error: any) {
        console.error('addHotel error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to add hotel' });
    }
};

export const getAllHotels = async (req: AuthRequest, res: Response) => {
    try {
        const { status, isVerified } = req.query;
        const filter: any = {};
        if (status) filter.status = status;
        if (isVerified) filter.isVerified = isVerified === 'true';
        const hotels = await Hotel.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: hotels });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch hotels' });
    }
};

export const getHotelById = async (req: AuthRequest, res: Response) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ success: false, error: 'Hotel not found' });
        res.json({ success: true, data: hotel });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch hotel' });
    }
};

export const verifyHotel = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { isVerified, status, rejectionReason } = req.body;
        const hotel = await Hotel.findByIdAndUpdate(
            id,
            { isVerified, status, rejectionReason, verifiedAt: new Date() },
            { new: true }
        );
        if (!hotel) return res.status(404).json({ success: false, error: 'Hotel not found' });
        res.json({ success: true, data: hotel });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to verify hotel' });
    }
};

export const updateHotelStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const hotel = await Hotel.findByIdAndUpdate(id, { status }, { new: true });
        if (!hotel) return res.status(404).json({ success: false, error: 'Hotel not found' });
        res.json({ success: true, data: hotel });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to update hotel status' });
    }
};

// NEW: updateHotel (for PUT /hotels/:id)
export const updateHotel = async (req: AuthRequest, res: Response) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!hotel) return res.status(404).json({ success: false, error: 'Hotel not found' });
        res.json({ success: true, data: hotel });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to update hotel' });
    }
};

// NEW: deleteHotel (for DELETE /hotels/:id)
export const deleteHotel = async (req: AuthRequest, res: Response) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) return res.status(404).json({ success: false, error: 'Hotel not found' });
        res.json({ success: true, message: 'Hotel deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to delete hotel' });
    }
};

// ---------- DEAL ----------
// ... (keep your existing deal functions, they are fine) ----------
export const addDeal = async (req: AuthRequest, res: Response) => {
    try {
        const discountPercent = ((req.body.originalPrice - req.body.discountedPrice) / req.body.originalPrice) * 100;
        const deal = await Deal.create({ ...req.body, discountPercent });
        res.status(201).json({ success: true, data: deal });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to add deal' });
    }
};

export const getAllDeals = async (req: AuthRequest, res: Response) => {
    try {
        const { status, hotelId } = req.query;
        const filter: any = {};
        if (status) filter.status = status;
        if (hotelId) filter.hotelId = hotelId;
        const deals = await Deal.find(filter).populate('hotelId').sort({ createdAt: -1 });
        res.json({ success: true, data: deals });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch deals' });
    }
};

export const getDealById = async (req: AuthRequest, res: Response) => {
    try {
        const deal = await Deal.findById(req.params.id).populate('hotelId');
        if (!deal) return res.status(404).json({ success: false, error: 'Deal not found' });
        res.json({ success: true, data: deal });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch deal' });
    }
};

export const updateDeal = async (req: AuthRequest, res: Response) => {
    try {
        let updateData = { ...req.body };
        if (req.body.originalPrice && req.body.discountedPrice) {
            updateData.discountPercent = ((req.body.originalPrice - req.body.discountedPrice) / req.body.originalPrice) * 100;
        }
        const deal = await Deal.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!deal) return res.status(404).json({ success: false, error: 'Deal not found' });
        res.json({ success: true, data: deal });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to update deal' });
    }
};

export const deleteDeal = async (req: AuthRequest, res: Response) => {
    try {
        const deal = await Deal.findByIdAndDelete(req.params.id);
        if (!deal) return res.status(404).json({ success: false, error: 'Deal not found' });
        res.json({ success: true, message: 'Deal deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to delete deal' });
    }
};

// ---------- FOOD ----------
// ... (your existing food functions are fine) ----------
export const addFoodItem = async (req: AuthRequest, res: Response) => {
    try {
        const foodItem = await FoodItem.create(req.body);
        res.status(201).json({ success: true, data: foodItem });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to add food item' });
    }
};

export const getAllFoodItems = async (req: AuthRequest, res: Response) => {
    try {
        const { hotelId, category, isAvailable } = req.query;
        const filter: any = {};
        if (hotelId) filter.hotelId = hotelId;
        if (category) filter.category = category;
        if (isAvailable) filter.isAvailable = isAvailable === 'true';
        const foodItems = await FoodItem.find(filter).populate('hotelId');
        res.json({ success: true, data: foodItems });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch food items' });
    }
};

export const getFoodItemById = async (req: AuthRequest, res: Response) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id).populate('hotelId');
        if (!foodItem) return res.status(404).json({ success: false, error: 'Food item not found' });
        res.json({ success: true, data: foodItem });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch food item' });
    }
};

export const updateFoodItem = async (req: AuthRequest, res: Response) => {
    try {
        const foodItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!foodItem) return res.status(404).json({ success: false, error: 'Food item not found' });
        res.json({ success: true, data: foodItem });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to update food item' });
    }
};

export const deleteFoodItem = async (req: AuthRequest, res: Response) => {
    try {
        const foodItem = await FoodItem.findByIdAndDelete(req.params.id);
        if (!foodItem) return res.status(404).json({ success: false, error: 'Food item not found' });
        res.json({ success: true, message: 'Food item deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to delete food item' });
    }
};