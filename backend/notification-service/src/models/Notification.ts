import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, enum: ['email', 'sms', 'push'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    recipient: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
    sentAt: { type: Date },
    error: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export const NotificationModel = mongoose.model('Notification', notificationSchema);