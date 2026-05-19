import mongoose from 'mongoose';

const offerTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },        // e.g. "Trending Top Deals"
  slug: { type: String, required: true, unique: true },        // e.g. "trending-top-deals"
  heroImage: { type: String, required: true },                 // uploaded image URL
  heroTitle: { type: String, required: true },
  heroSubtitle: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 },                         // for sorting in navbar
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const OfferType = mongoose.model('OfferType', offerTypeSchema);