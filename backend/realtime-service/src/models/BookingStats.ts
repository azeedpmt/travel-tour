import mongoose from 'mongoose';

const bookingStatsSchema = new mongoose.Schema({
    metric: { type: String, required: true, unique: true },
    value: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});

export const BookingStats = mongoose.model('BookingStats', bookingStatsSchema);