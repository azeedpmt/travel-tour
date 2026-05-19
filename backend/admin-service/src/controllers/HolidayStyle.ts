import { Response } from 'express';
import { HolidayStyle } from '../models/HolidayStyle';
import { AuthRequest } from '../middlewares/isAuth';

export const getAllHolidayStyles = async (req: AuthRequest, res: Response) => {
  try {
    const styles = await HolidayStyle.find().sort({ order: 1 });
    res.json({ success: true, data: styles });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getActiveHolidayStyles = async (req: AuthRequest, res: Response) => {
  try {
    const styles = await HolidayStyle.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, data: styles });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getHolidayStyleBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const style = await HolidayStyle.findOne({ slug, active: true });
    if (!style) return res.status(404).json({ success: false, error: 'Holiday style not found' });
    res.json({ success: true, data: style });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createHolidayStyle = async (req: AuthRequest, res: Response) => {
  try {
    const style = await HolidayStyle.create(req.body);
    res.status(201).json({ success: true, data: style });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateHolidayStyle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const style = await HolidayStyle.findByIdAndUpdate(id, req.body, { new: true });
    if (!style) return res.status(404).json({ success: false, error: 'Holiday style not found' });
    res.json({ success: true, data: style });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteHolidayStyle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const style = await HolidayStyle.findByIdAndDelete(id);
    if (!style) return res.status(404).json({ success: false, error: 'Holiday style not found' });
    res.json({ success: true, message: 'Holiday style deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};