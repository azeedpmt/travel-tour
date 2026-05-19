import { Response } from 'express';
import { Request } from 'express';
import { Booking } from '../models/Booking';
import { AuthRequest } from '../middlewares/isAuth';
import { getChannel } from '../config/rabbitmq';
import axios from 'axios';

// Create booking
export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { guestDetails, checkInDate, checkOutDate, hotelId, dealId, totalAmount, numberOfRooms, numberOfGuests, foodItems, specialRequests } = req.body;
        
        // Validate required fields
        if (!guestDetails || !checkInDate || !checkOutDate || !hotelId || !totalAmount) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        
        const booking = await Booking.create({
            ...req.body,
            userId: req.userId,
            bookingStatus: 'pending'
        });
        
        // Update deal currentBookings if deal is selected
        if (dealId) {
            try {
                await axios.put(`${process.env.DEAL_SERVICE_URL}/api/deals/${dealId}/increment-bookings`);
            } catch (error) {
                console.error('Failed to update deal bookings:', error);
            }
        }
        
        // Publish to queue
        const channel = getChannel();
        if (channel) {
            channel.sendToQueue('BOOKING_QUEUE', Buffer.from(JSON.stringify({
                type: 'BOOKING_CREATED',
                bookingId: booking._id,
                userId: booking.userId,
                totalAmount: booking.totalAmount,
                timestamp: new Date()
            })));
        }
        
        res.status(201).json({ success: true, data: booking });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to create booking' });
    }
};

// Get user bookings
export const getUserBookings = async (req: AuthRequest, res: Response) => {
    try {
        const bookings = await Booking.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .populate('dealId', 'title discountedPrice')
            .populate('hotelId', 'name city images');
        res.json({ success: true, data: bookings });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch bookings' });
    }
};

// Get booking by ID
export const getBookingById = async (req: AuthRequest, res: Response) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('dealId')
            .populate('hotelId');
        
        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }
        
        // Check if user owns this booking or is admin
        if (booking.userId.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }
        
        res.json({ success: true, data: booking });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch booking' });
    }
};

// Cancel booking
export const cancelBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { cancellationReason } = req.body;
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }
        
        // Check if user owns this booking
        if (booking.userId.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }
        
        // Can only cancel if booking is confirmed or pending
        if (booking.bookingStatus === 'cancelled') {
            return res.status(400).json({ success: false, error: 'Booking already cancelled' });
        }
        
        booking.bookingStatus = 'cancelled';
        booking.cancellationReason = cancellationReason;
        booking.cancelledAt = new Date();
        booking.paymentStatus = 'refunded';
        await booking.save();
        
        const channel = getChannel();
        if (channel) {
            channel.sendToQueue('BOOKING_QUEUE', Buffer.from(JSON.stringify({
                type: 'BOOKING_CANCELLED',
                bookingId: booking._id,
                userId: booking.userId,
                amount: booking.totalAmount,
                timestamp: new Date()
            })));
        }
        
        res.json({ success: true, data: booking });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to cancel booking' });
    }
};

// Update payment status
export const updatePaymentStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { paymentStatus, paymentId } = req.body;
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }
        
        booking.paymentStatus = paymentStatus;
        booking.paymentId = paymentId;
        
        if (paymentStatus === 'completed') {
            booking.bookingStatus = 'confirmed';
        }
        
        await booking.save();
        
        res.json({ success: true, data: booking });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to update payment status' });
    }
};

// Get all bookings (admin)
export const getAllBookings = async (req: AuthRequest, res: Response) => {
    try {
        const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
        let query: any = {};
        
        if (status) query.bookingStatus = status;
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string)
            };
        }
        
        const skip = (Number(page) - 1) * Number(limit);
        
        const [bookings, total] = await Promise.all([
            Booking.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .populate('hotelId', 'name city'),
            Booking.countDocuments(query)
        ]);
        
        res.json({ 
            success: true, 
            data: bookings,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch bookings' });
    }
};

// Get hotel bookings (for hotel owners/admins)
export const getHotelBookings = async (req: AuthRequest, res: Response) => {
    try {
        const { hotelId } = req.params;
        const bookings = await Booking.find({ hotelId })
            .sort({ checkInDate: -1 })
            .populate('userId', 'name email phone');
        
        res.json({ success: true, data: bookings });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch hotel bookings' });
    }
};


// Check availability
export const checkAvailability = async (req: any, res: Response) => {
    try {
        const { hotelId, checkInDate, checkOutDate, numberOfRooms } = req.query;
        
        if (!hotelId || !checkInDate || !checkOutDate) {
            return res.status(400).json({ success: false, error: 'Missing required parameters' });
        }
        
        const existingBookings = await Booking.find({
            hotelId,
            bookingStatus: { $in: ['confirmed', 'pending'] },
            $or: [
                {
                    checkInDate: { $lt: new Date(checkOutDate as string) },
                    checkOutDate: { $gt: new Date(checkInDate as string) }
                }
            ]
        });
        
        const bookedRooms = existingBookings.reduce((sum, booking) => sum + booking.numberOfRooms, 0);
        
        // Get hotel total rooms (you might want to fetch from hotel service)
        let totalRooms = 10; // Default fallback
        try {
            const hotelResponse = await axios.get(`${process.env.HOTEL_SERVICE_URL}/api/hotels/${hotelId}`);
            totalRooms = hotelResponse.data.totalRooms || 10;
        } catch (error) {
            console.error('Failed to fetch hotel details:', error);
        }
        
        const availableRooms = totalRooms - bookedRooms;
        const requestedRooms = Number(numberOfRooms) || 1;
        
        res.json({
            success: true,
            data: {
                available: availableRooms >= requestedRooms,
                availableRooms,
                totalRooms,
                bookedRooms,
                requestedRooms
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to check availability' });
    }
};

// In booking service - listen to payment queue
// Handle payment success message from payment service
const handlePaymentSuccess = async (data: any) => {
    const { bookingId, paymentId, status } = data;
    
    if (status === 'completed') {
        await Booking.findByIdAndUpdate(bookingId, {
            paymentStatus: 'completed',
            paymentId: paymentId,
            bookingStatus: 'confirmed'
        });
    }
};