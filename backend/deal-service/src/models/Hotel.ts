import mongoose from 'mongoose';

// Minimal Hotel schema to allow populate('hotelId') to work
// without having the full Hotel model in deal-service.
const hotelSchema = new mongoose.Schema(
  {
    name: { type: String },
    city: { type: String },
    state: { type: String },
    rating: { type: Number, default: 0 },
    images: [{ type: String }],
    // strict: false allows any other fields from the original Hotel collection
  },
  { strict: false, timestamps: false }
);

export const Hotel = mongoose.model('Hotel', hotelSchema, 'hotels'); // explicitly use 'hotels' collection