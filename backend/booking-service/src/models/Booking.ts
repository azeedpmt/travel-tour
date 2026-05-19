import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    foodItems: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
        name: { type: String },
        quantity: { type: Number, default: 0 },
        price: { type: Number, default: 0 }
    }],
    roomType: {
        name: { type: String },
        quantity: { type: Number, default: 0 },
        price: { type: Number, default: 0 }
    },
    guestDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        passportNumber: { type: String },
        numberOfAdults: { type: Number, required: true, default: 1 },
        numberOfChildren: { type: Number, default: 0 }
    },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true },
    numberOfRooms: { type: Number, required: true, default: 1 },
    totalAmount: { type: Number, required: true },
    paymentId: { type: String },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'completed', 'failed', 'refunded'], 
        default: 'pending' 
    },
    bookingStatus: { 
        type: String, 
        enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
        default: 'pending' 
    },
    specialRequests: { type: String },
    cancellationReason: { type: String },
    cancelledAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.model('Booking', bookingSchema);