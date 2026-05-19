import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import amqp from 'amqplib';
import { connectDB } from './config/db';
import { OnlineUser } from '../src/models/OnlineUser';
import {  UserLocation } from '../src/models/UserLocation';
import { HotelOwner,  } from '../src/models/HotelOwner';
import {  BookingStats } from '../src/models/BookingStats';
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
    }
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// RabbitMQ connection
let channel: amqp.Channel;

const setupRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL!);
        channel = await connection.createChannel();
        
        // Consume from various queues
        await channel.assertQueue('BOOKING_QUEUE', { durable: true });
        await channel.assertQueue('PAYMENT_QUEUE', { durable: true });
        await channel.assertQueue('DEAL_QUEUE', { durable: true });
        
        channel.consume('BOOKING_QUEUE', (msg) => {
            if (msg) {
                const data = JSON.parse(msg.content.toString());
                handleBookingEvent(data);
                channel.ack(msg);
            }
        });
        
        channel.consume('PAYMENT_QUEUE', (msg) => {
            if (msg) {
                const data = JSON.parse(msg.content.toString());
                handlePaymentEvent(data);
                channel.ack(msg);
            }
        });
        
        channel.consume('DEAL_QUEUE', (msg) => {
            if (msg) {
                const data = JSON.parse(msg.content.toString());
                handleDealEvent(data);
                channel.ack(msg);
            }
        });
        
        console.log('RabbitMQ connected successfully for Realtime Service');
    } catch (error) {
        console.error('RabbitMQ connection failed:', error);
        setTimeout(setupRabbitMQ, 5000);
    }
};

// Handle booking events
const handleBookingEvent = async (data: any) => {
    try {
        switch (data.type) {
            case 'BOOKING_CREATED':
                // Notify user
                io.to(`user_${data.userId}`).emit('booking_created', data);
                
                // Get hotel owner from database
                const hotelOwner = await HotelOwner.findOne({ hotelId: data.hotelId });
                if (hotelOwner) {
                    io.to(`user_${hotelOwner.ownerId}`).emit('new_booking', data);
                }
                
                // Update stats
                await BookingStats.findOneAndUpdate(
                    { metric: 'total_bookings' },
                    { $inc: { value: 1 } }
                );
                await BookingStats.findOneAndUpdate(
                    { metric: 'active_bookings' },
                    { $inc: { value: 1 } }
                );
                break;
                
            case 'BOOKING_CANCELLED':
                io.to(`user_${data.userId}`).emit('booking_cancelled', data);
                
                // Update stats
                await BookingStats.findOneAndUpdate(
                    { metric: 'active_bookings' },
                    { $inc: { value: -1 } }
                );
                break;
                
            case 'BOOKING_COMPLETED':
                await BookingStats.findOneAndUpdate(
                    { metric: 'active_bookings' },
                    { $inc: { value: -1 } }
                );
                break;
        }
    } catch (error) {
        console.error('Error handling booking event:', error);
    }
};

// Handle payment events
const handlePaymentEvent = async (data: any) => {
    try {
        switch (data.type) {
            case 'PAYMENT_SUCCESS':
                io.to(`user_${data.userId}`).emit('payment_success', data);
                
                // Update revenue stats
                if (data.amount) {
                    await BookingStats.findOneAndUpdate(
                        { metric: 'total_revenue' },
                        { $inc: { value: data.amount } }
                    );
                }
                break;
            case 'PAYMENT_FAILED':
                io.to(`user_${data.userId}`).emit('payment_failed', data);
                break;
        }
    } catch (error) {
        console.error('Error handling payment event:', error);
    }
};

// Handle deal events
const handleDealEvent = async (data: any) => {
    try {
        switch (data.type) {
            case 'DEAL_CREATED':
                // Broadcast new deal to all users
                io.emit('new_deal_available', data);
                break;
            case 'DEAL_UPDATED':
                io.emit('deal_updated', data);
                break;
        }
    } catch (error) {
        console.error('Error handling deal event:', error);
    }
};

// Socket authentication middleware
io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        socket.data.userId = decoded.userId;
        socket.data.role = decoded.role;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
});

// Socket connection handling
io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.data.userId}`);
    
    // Join user room
    socket.join(`user_${socket.data.userId}`);
    
    // Store online user in MongoDB
    try {
        await OnlineUser.findOneAndUpdate(
            { userId: socket.data.userId },
            { userId: socket.data.userId, socketId: socket.id, role: socket.data.role, lastSeen: new Date() },
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error('Error storing online user:', error);
    }
    
    // Handle joining hotel room (for hotel owners)
    socket.on('join_hotel_room', async (hotelId: string) => {
        socket.join(`hotel_${hotelId}`);
        try {
            await HotelOwner.findOneAndUpdate(
                { hotelId: hotelId },
                { hotelId: hotelId, ownerId: socket.data.userId, socketId: socket.id, updatedAt: new Date() },
                { upsert: true, new: true }
            );
        } catch (error) {
            console.error('Error storing hotel owner:', error);
        }
    });
    
    // Handle typing indicator
    socket.on('typing', (data: { bookingId: string, isTyping: boolean }) => {
        socket.to(`booking_${data.bookingId}`).emit('user_typing', {
            userId: socket.data.userId,
            isTyping: data.isTyping
        });
    });
    
    // Handle live location tracking (for travel)
    socket.on('update_location', async (data: { bookingId: string, latitude: number, longitude: number }) => {
        try {
            // Store location in MongoDB with TTL
            await UserLocation.findOneAndUpdate(
                { bookingId: data.bookingId },
                {
                    bookingId: data.bookingId,
                    userId: socket.data.userId,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    timestamp: new Date()
                },
                { upsert: true, new: true }
            );
            
            // Broadcast to relevant parties
            socket.to(`booking_${data.bookingId}`).emit('location_updated', {
                userId: socket.data.userId,
                location: { lat: data.latitude, lng: data.longitude }
            });
        } catch (error) {
            console.error('Error updating location:', error);
        }
    });
    
    // Handle disconnect
    socket.on('disconnect', async () => {
        console.log(`User disconnected: ${socket.data.userId}`);
        try {
            await OnlineUser.deleteOne({ userId: socket.data.userId });
            await HotelOwner.deleteOne({ ownerId: socket.data.userId });
        } catch (error) {
            console.error('Error removing online user:', error);
        }
    });
});

// REST endpoints for realtime data
app.get('/api/realtime/online-users', async (req, res) => {
    try {
        const onlineUsers = await OnlineUser.find({}).select('userId role lastSeen -_id');
        res.json({ success: true, data: onlineUsers, count: onlineUsers.length });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/realtime/location/:bookingId', async (req, res) => {
    try {
        const location = await UserLocation.findOne({ bookingId: req.params.bookingId });
        res.json({ success: true, data: location });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/realtime/booking-stats', async (req, res) => {
    try {
        const stats = await BookingStats.find({});
        const statsObject: any = {};
        stats.forEach(stat => {
            statsObject[stat.metric] = stat.value;
        });
        res.json({ success: true, data: statsObject });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Realtime Service', timestamp: new Date() });
});

setupRabbitMQ();

const PORT = process.env.PORT || 8007;
httpServer.listen(PORT, () => {
    console.log(`Realtime Service running on port ${PORT}`);
});
