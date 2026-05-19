import mongoose from 'mongoose';

const hotelOwnerSchema = new mongoose.Schema({
    hotelId: { type: String, required: true, unique: true },
    ownerId: { type: String, required: true },
    socketId: { type: String },
    updatedAt: { type: Date, default: Date.now }
});

export const HotelOwner = mongoose.model('HotelOwner', hotelOwnerSchema);
