import { Response } from 'express';
import { OfferType } from '../models/OfferType';
import { AuthRequest } from '../middlewares/isAuth';

// Get all offer types (admin)
export const getAllOfferTypes = async (req: AuthRequest, res: Response) => {
  try {
    const types = await OfferType.find().sort({ order: 1 });
    res.json({ success: true, data: types });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get active offer types for public navbar
export const getActiveOfferTypes = async (req: AuthRequest, res: Response) => {
  try {
    const types = await OfferType.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, data: types });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single offer type by slug (public)
export const getOfferTypeBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const type = await OfferType.findOne({ slug, active: true });
    if (!type) return res.status(404).json({ success: false, error: 'Offer type not found' });
    res.json({ success: true, data: type });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create offer type (with image upload handled separately)
export const createOfferType = async (req: AuthRequest, res: Response) => {
  try {
    // req.body already contains heroImage URL (after upload)
    const type = await OfferType.create(req.body);
    res.status(201).json({ success: true, data: type });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update offer type
export const updateOfferType = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const type = await OfferType.findByIdAndUpdate(id, req.body, { new: true });
    if (!type) return res.status(404).json({ success: false, error: 'Offer type not found' });
    res.json({ success: true, data: type });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete offer type
export const deleteOfferType = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const type = await OfferType.findByIdAndDelete(id);
    if (!type) return res.status(404).json({ success: false, error: 'Offer type not found' });
    res.json({ success: true, message: 'Offer type deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};