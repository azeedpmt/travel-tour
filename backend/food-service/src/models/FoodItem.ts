import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    cuisine: { type: String, required: true },
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    spicyLevel: { type: String, enum: ['mild', 'medium', 'hot', 'extra hot'], default: 'medium' },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    images: [{ type: String }],
    ingredients: [{ type: String }],
    nutritionalInfo: {
        calories: { type: Number },
        protein: { type: Number },
        carbs: { type: Number },
        fat: { type: Number }
    },
    rating: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    preparationTime: { type: Number, default: 30 },
    createdAt: { type: Date, default: Date.now }
});

export const FoodItem = mongoose.model('FoodItem', foodItemSchema);