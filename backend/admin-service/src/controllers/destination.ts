import { Response } from 'express';
import { Destination } from '../models/Destination';
import { AuthRequest } from '../middlewares/isAuth';

// Get all destinations (Admin)
export const getAllDestinations = async (req: AuthRequest, res: Response) => {
  try {
    const destinations = await Destination.find().sort({ name: 1 });
    res.json({ success: true, data: destinations });
  } catch (error: any) {
    console.error('Get all destinations error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single destination by slug (Public)
export const getDestinationBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const destination = await Destination.findOne({ slug }).populate('deals');
    if (!destination) {
      return res.status(404).json({ success: false, error: 'Destination not found' });
    }
    res.json({ success: true, data: destination });
  } catch (error: any) {
    console.error('Get destination by slug error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new destination (Admin)
export const createDestination = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Received body:', JSON.stringify(req.body, null, 2));
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, data: destination });
  } catch (error: any) {
    console.error('Create destination error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update destination (Admin)
export const updateDestination = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!destination) {
      return res.status(404).json({ success: false, error: 'Destination not found' });
    }
    res.json({ success: true, data: destination });
  } catch (error: any) {
    console.error('Update destination error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete destination (Admin)
export const deleteDestination = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findByIdAndDelete(id);
    if (!destination) {
      return res.status(404).json({ success: false, error: 'Destination not found' });
    }
    res.json({ success: true, message: 'Destination deleted successfully' });
  } catch (error: any) {
    console.error('Delete destination error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};