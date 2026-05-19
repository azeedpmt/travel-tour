import { Response } from 'express';
import { FoodItem } from '../models/FoodItem';
import { AuthRequest } from '../middlewares/isAuth';
import { getChannel } from '../config/rabbitmq';

// Get all food items
export const getAllFoodItems = async (req: AuthRequest, res: Response) => {
    try {
        const { hotelId, category, cuisine, vegetarian, vegan, glutenFree } = req.query;
        let query: any = {};
        
        if (hotelId) query.hotelId = hotelId;
        if (category) query.category = category;
        if (cuisine) query.cuisine = cuisine;
        if (vegetarian === 'true') query.isVegetarian = true;
        if (vegan === 'true') query.isVegan = true;
        if (glutenFree === 'true') query.isGlutenFree = true;
        
        const foodItems = await FoodItem.find(query).populate('hotelId', 'name city');
        res.json({ success: true, data: foodItems });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch food items' });
    }
};

// Get food item by ID
export const getFoodItemById = async (req: AuthRequest, res: Response) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id).populate('hotelId', 'name city');
        if (!foodItem) {
            return res.status(404).json({ success: false, error: 'Food item not found' });
        }
        res.json({ success: true, data: foodItem });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch food item' });
    }
};

// Create food item (admin/hotel owner only)
export const createFoodItem = async (req: AuthRequest, res: Response) => {
    try {
        const foodItem = await FoodItem.create(req.body);
        
        const channel = getChannel();
        if (channel) {
            channel.sendToQueue('FOOD_QUEUE', Buffer.from(JSON.stringify({
                type: 'FOOD_CREATED',
                foodItemId: foodItem._id,
                hotelId: foodItem.hotelId,
                timestamp: new Date()
            })));
        }
        
        res.status(201).json({ success: true, data: foodItem });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to create food item' });
    }
};

// Update food item
export const updateFoodItem = async (req: AuthRequest, res: Response) => {
    try {
        const foodItem = await FoodItem.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        
        if (!foodItem) {
            return res.status(404).json({ success: false, error: 'Food item not found' });
        }
        
        res.json({ success: true, data: foodItem });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to update food item' });
    }
};

// Delete food item
export const deleteFoodItem = async (req: AuthRequest, res: Response) => {
    try {
        const foodItem = await FoodItem.findByIdAndDelete(req.params.id);
        
        if (!foodItem) {
            return res.status(404).json({ success: false, error: 'Food item not found' });
        }
        
        res.json({ success: true, message: 'Food item deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to delete food item' });
    }
};

// Get menu by hotel
export const getMenuByHotel = async (req: AuthRequest, res: Response) => {
    try {
        const { hotelId } = req.params;
        const menu = await FoodItem.find({ hotelId, isAvailable: true });
        
        // Group by category
        const groupedMenu = menu.reduce((acc: any, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
            return acc;
        }, {});
        
        res.json({ success: true, data: groupedMenu });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch menu' });
    }
};

// Search food items
export const searchFoodItems = async (req: AuthRequest, res: Response) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ success: false, error: 'Search query required' });
        }
        
        const foodItems = await FoodItem.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { cuisine: { $regex: q, $options: 'i' } }
            ],
            isAvailable: true
        }).populate('hotelId', 'name city');
        
        res.json({ success: true, data: foodItems });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to search food items' });
    }
};

// Update availability
export const updateAvailability = async (req: AuthRequest, res: Response) => {
    try {
        const { isAvailable } = req.body;
        const foodItem = await FoodItem.findByIdAndUpdate(
            req.params.id,
            { isAvailable },
            { new: true }
        );
        
        if (!foodItem) {
            return res.status(404).json({ success: false, error: 'Food item not found' });
        }
        
        res.json({ success: true, data: foodItem });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to update availability' });
    }
};

// Get popular food items
export const getPopularFoodItems = async (req: AuthRequest, res: Response) => {
    try {
        const { limit = 10 } = req.query;
        const foodItems = await FoodItem.find({ isAvailable: true })
            .sort({ totalOrders: -1, rating: -1 })
            .limit(Number(limit))
            .populate('hotelId', 'name city');
        
        res.json({ success: true, data: foodItems });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch popular food items' });
    }
};

// Increment total orders (called by booking service)
export const incrementOrders = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const foodItem = await FoodItem.findByIdAndUpdate(
            id,
            { $inc: { totalOrders: 1 } },
            { new: true }
        );
        
        if (!foodItem) {
            return res.status(404).json({ success: false, error: 'Food item not found' });
        }
        
        res.json({ success: true, data: foodItem });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to increment orders' });
    }
};

