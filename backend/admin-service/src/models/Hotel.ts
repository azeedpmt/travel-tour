import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
    pincode: { type: String, required: true },
    description: { type: String, required: true },
    amenities: [{ type: String }],
    roomTypes: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        availableRooms: { type: Number, required: true, default: 0 },
        maxGuests: { type: Number, required: true, default: 2 },
        description: { type: String }
    }],
    images: [{ type: String }],
    rating: { type: Number, default: 0 },
    totalRooms: { type: Number, default: 0 },
    checkInTime: { type: String, default: '14:00' },
    checkOutTime: { type: String, default: '11:00' },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'active'], default: 'pending' },
    rejectionReason: { type: String },
    verifiedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

hotelSchema.pre('save', function(next) {
    if (this.roomTypes && this.roomTypes.length > 0) {
        this.totalRooms = this.roomTypes.reduce((sum, room) => sum + (room.availableRooms || 0), 0);
    }
    next();
});

export const Hotel = mongoose.model('Hotel', hotelSchema);