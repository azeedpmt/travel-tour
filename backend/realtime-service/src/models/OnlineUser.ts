import mongoose from 'mongoose';

const onlineUserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    socketId: { type: String, required: true },
    role: { type: String, default: 'user' },
    lastSeen: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now, expires: 300 } // Auto delete after 5 minutes
});

export const OnlineUser = mongoose.model('OnlineUser', onlineUserSchema);