import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },   // e.g. "Greece"
  slug: { type: String, required: true, unique: true },   // e.g. "greece"
  region: { type: String, enum: ['europe', 'asia', 'america', 'africa', 'middleeast'], required: true },
  image: { type: String, required: true },
  description: { type: String },
  featured: { type: Boolean, default: false },             // mark one as featured
  deals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deal' }],
  createdAt: { type: Date, default: Date.now }
});

export const Destination = mongoose.model('Destination', destinationSchema);