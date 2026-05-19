import mongoose from 'mongoose';

const userLocationSchema = new mongoose.Schema({
    bookingId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now, expires: 60 } // Auto delete after 60 seconds
});

export const UserLocation = mongoose.model('UserLocation', userLocationSchema);