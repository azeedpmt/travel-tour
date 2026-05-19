import mongoose from 'mongoose';

const weatherCardSchema = new mongoose.Schema({
  season: { type: String, default: '' },
  heading: { type: String, default: '' },
  temp: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' }
});

const zigzagCardSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  order: { type: String, enum: ['left', 'right'], default: 'right' }
});

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  heroImage: { type: String, default: '' },
  heroTitle: { type: String, default: '' },
  heroSubtitle: { type: String, default: '' },
  experienceTitle: { type: String, default: '' },
  experienceDescription: { type: String, default: '' },
  experienceImage: { type: String, default: '' },
  readMoreText: { type: String, default: '' },
  mapEmbedUrl: { type: String, default: '' },
  weather: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    cards: [weatherCardSchema]
  },
  zigzagCards: [zigzagCardSchema],
  deals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deal' }]
}, { timestamps: true });

export const Destination = mongoose.model('Destination', destinationSchema);