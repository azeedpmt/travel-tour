import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { setupRabbitMQ, sendEmailNotification, sendSMSNotification } from './config/rabbitmq';
import { NotificationModel } from './models/Notification';

dotenv.config();

const app = express();
connectDB();
setupRabbitMQ();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Notification Service', timestamp: new Date() });
});

// Get notifications for a user
app.get('/api/notifications/user/:userId', async (req, res) => {
    try {
        const notifications = await NotificationModel.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json({ success: true, data: notifications });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get notification by ID
app.get('/api/notifications/:id', async (req, res) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }
        res.json({ success: true, data: notification });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Send test email
app.post('/api/notifications/test-email', async (req, res) => {
    try {
        const { email, title, message } = req.body;
        const result = await sendEmailNotification({
            userId: 'test',
            email,
            title,
            message,
            recipient: email
        });
        res.json({ success: true, data: { sent: result } });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Send test SMS
app.post('/api/notifications/test-sms', async (req, res) => {
    try {
        const { phone, message } = req.body;
        const result = await sendSMSNotification({
            userId: 'test',
            phone,
            title: 'Test SMS',
            message,
            recipient: phone
        });
        res.json({ success: true, data: { sent: result } });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get notification stats
app.get('/api/notifications/stats', async (req, res) => {
    try {
        const total = await NotificationModel.countDocuments();
        const sent = await NotificationModel.countDocuments({ status: 'sent' });
        const failed = await NotificationModel.countDocuments({ status: 'failed' });
        const byType = await NotificationModel.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);
        
        res.json({ 
            success: true, 
            data: { total, sent, failed, byType }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 8009;
app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
});
