import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    foodItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }],
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    discountPercent: { type: Number },
    duration: { type: Number, required: true },
    includes: [{ type: String }],
    excludes: [{ type: String }],
    images: [{ type: String }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    maxBookings: { type: Number, required: true },
    currentBookings: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    category: { 
        type: String, 
        enum: ['adventure', 'romantic', 'family', 'business', 'luxury'], 
        default: 'family' 
    },
    status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'active' },
    
    // NEW FIELDS for filtering & detail page
    offerType: { 
        type: String, 
        enum: ['trending-top-deals', 'last-minute-bargains', 'trending-multi-centres', 'summer-2026-early-deals', '5-star-luxury-for-less', 'mitsis-hotel-group'],
        default: null 
    },
    holidayStyle: { 
        type: String, 
        enum: ['all-inclusive', 'adults-only', 'city-breaks', 'beach-holidays', 'family-holidays', 'multi-centre'],
        default: null 
    },
    destinationId: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'Destination', 
  default: null 
},
    excursion: {
        title: { type: String },
        description: { type: String },
        included: { type: Boolean, default: false }
    },
    whyLove: [{ type: String }],      // array of reasons why we love this hotel
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});





export const Deal = mongoose.model('Deal', dealSchema);