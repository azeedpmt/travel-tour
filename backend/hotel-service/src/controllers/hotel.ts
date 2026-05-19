import { Response } from 'express';
import { Hotel } from '../models/Hotel';
import { AuthRequest } from '../middlewares/isAuth';
import { getChannel } from '../config/rabbitmq';

// Get all hotels (public - only verified hotels)
export const getAllHotels = async (req: AuthRequest, res: Response) => {
    try {
        const { city, state, minRating, sort, status } = req.query;
        let query: any = { status: 'approved', isVerified: true };
        
        if (city) query.city = { $regex: city, $options: 'i' };
        if (state) query.state = { $regex: state, $options: 'i' };
        if (minRating) query.rating = { $gte: Number(minRating) };
        
        let hotelsQuery = Hotel.find(query);
        
        if (sort === 'rating') hotelsQuery = hotelsQuery.sort({ rating: -1 });
        if (sort === 'newest') hotelsQuery = hotelsQuery.sort({ createdAt: -1 });
        
        const hotels = await hotelsQuery;
        res.json({ success: true, data: hotels });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch hotels' });
    }
};

// Get all hotels for admin (including pending)
export const getAllHotelsAdmin = async (req: AuthRequest, res: Response) => {
    try {
        const { status, isVerified } = req.query;
        let query: any = {};
        
        if (status) query.status = status;
        if (isVerified) query.isVerified = isVerified === 'true';
        
        const hotels = await Hotel.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: hotels });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch hotels' });
    }
};

// Get hotel by ID
export const getHotelById = async (req: AuthRequest, res: Response) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ success: false, error: 'Hotel not found' });
        }
        res.json({ success: true, data: hotel });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch hotel' });
    }
};

// Create hotel
export const createHotel = async (req: AuthRequest, res: Response) => {
    try {
        const hotelData = {
            ...req.body,
            ownerId: req.userId,
            status: 'pending',
            isVerified: false
        };
        
        const hotel = await Hotel.create(hotelData);
        
        const channel = getChannel();
        if (channel) {
            channel.sendToQueue('HOTEL_QUEUE', Buffer.from(JSON.stringify({
                type: 'HOTEL_CREATED',
                hotelId: hotel._id,
                ownerId: req.userId,
                timestamp: new Date()
            })));
        }
        
        res.status(201).json({ success: true, data: hotel });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to create hotel' });
    }
};

// Update hotel
export const updateHotel = async (req: AuthRequest, res: Response) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        
        if (!hotel) {
            return res.status(404).json({ success: false, error: 'Hotel not found' });
        }
        
        // Check if user owns this hotel or is admin
        if (hotel.ownerId?.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }
        
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        
        res.json({ success: true, data: updatedHotel });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to update hotel' });
    }
};

// Verify hotel (admin only)
export const verifyHotel = async (req: AuthRequest, res: Response) => {
    try {
        const { isVerified, status, rejectionReason } = req.body;
        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { 
                isVerified, 
                status, 
                rejectionReason,
                verifiedAt: isVerified ? new Date() : undefined
            },
            { new: true }
        );
        
        if (!hotel) {
            return res.status(404).json({ success: false, error: 'Hotel not found' });
        }
        
        const channel = getChannel();
        if (channel) {
            channel.sendToQueue('HOTEL_QUEUE', Buffer.from(JSON.stringify({
                type: 'HOTEL_VERIFIED',
                hotelId: hotel._id,
                isVerified,
                status,
                timestamp: new Date()
            })));
        }
        
        res.json({ success: true, data: hotel });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to verify hotel' });
    }
};

// Search hotels
export const searchHotels = async (req: AuthRequest, res: Response) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ success: false, error: 'Search query required' });
        }
        
        const hotels = await Hotel.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { city: { $regex: q, $options: 'i' } },
                { address: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ],
            status: 'approved',
            isVerified: true
        });
        
        res.json({ success: true, data: hotels });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to search hotels' });
    }
};

// Get hotels by owner
export const getHotelsByOwner = async (req: AuthRequest, res: Response) => {
    try {
        const hotels = await Hotel.find({ ownerId: req.userId });
        res.json({ success: true, data: hotels });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch hotels' });
    }
};

// Get available rooms
export const getAvailableRooms = async (req: AuthRequest, res: Response) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ success: false, error: 'Hotel not found' });
        }
        
        const availableRooms = hotel.roomTypes.filter(room => room.availableRooms > 0);
        res.json({ success: true, data: availableRooms });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch available rooms' });
    }
};

// Delete hotel (admin only)
export const deleteHotel = async (req: AuthRequest, res: Response) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        
        if (!hotel) {
            return res.status(404).json({ success: false, error: 'Hotel not found' });
        }
        
        res.json({ success: true, message: 'Hotel deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to delete hotel' });
    }
};