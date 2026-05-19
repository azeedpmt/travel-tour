import mongoose from 'mongoose';

const holidayStyleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  heroImage: { type: String, required: true },
  heroTitle: { type: String, required: true },
  heroSubtitle: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const HolidayStyle = mongoose.model('HolidayStyle', holidayStyleSchema);