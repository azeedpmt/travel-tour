import { Response } from 'express';
import { Deal } from '../models/Deal';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/isAuth';
import { getChannel } from '../config/rabbitmq';
import { Hotel } from '../models/Hotel';  // add this line
import { Destination } from '../models/Destination';
// Get all active deals
// export const getAllDeals = async (req: AuthRequest, res: Response) => {
//     try {
//         const { category, minPrice, maxPrice, sort } = req.query;
//         let query: any = { status: 'active', endDate: { $gte: new Date() } };
        
//         if (category) query.category = category;
//         if (minPrice || maxPrice) {
//             query.discountedPrice = {};
//             if (minPrice) query.discountedPrice.$gte = Number(minPrice);
//             if (maxPrice) query.discountedPrice.$lte = Number(maxPrice);
//         }
        
//         let dealsQuery = Deal.find(query);
        
//         if (sort === 'price_asc') dealsQuery = dealsQuery.sort({ discountedPrice: 1 });
//         if (sort === 'price_desc') dealsQuery = dealsQuery.sort({ discountedPrice: -1 });
//         if (sort === 'rating') dealsQuery = dealsQuery.sort({ rating: -1 });
        
//        const deals = await dealsQuery.populate('hotelId', 'name city rating images'); // only select needed fields
//         res.json({ success: true, data: deals });
//     } catch (error: any) {
//         res.status(500).json({ success: false, error: error.message || 'Failed to fetch deals' });
//     }
// };
// controllers/deal.ts - getAllDeals function

// export const getAllDeals = async (req: AuthRequest, res: Response) => {
//     try {
//          const { category, minPrice, maxPrice, sort, offerType, holidayStyle, destinationId, page = 1, limit = 10 } = req.query;
        
//         let query: any = {};
        
//         if (category) query.category = category;
//         if (offerType) query.offerType = offerType;
//         if (holidayStyle) query.holidayStyle = holidayStyle;
//         if (destinationId) query.destinationId = destinationId;
//         if (minPrice || maxPrice) {
//             query.discountedPrice = {};
//             if (minPrice) query.discountedPrice.$gte = Number(minPrice);
//             if (maxPrice) query.discountedPrice.$lte = Number(maxPrice);
//         }
        
//         const pageNum = parseInt(page as string, 10);
//         const limitNum = parseInt(limit as string, 10);
//         const skip = (pageNum - 1) * limitNum;
        
//         let dealsQuery = Deal.find(query)
//             .populate('hotelId', 'name city country rating images description facilities address latitude longitude')
//             .skip(skip)
//             .limit(limitNum);
        
//         if (sort === 'price_asc') dealsQuery = dealsQuery.sort({ discountedPrice: 1 });
//         else if (sort === 'price_desc') dealsQuery = dealsQuery.sort({ discountedPrice: -1 });
//         else if (sort === 'rating') dealsQuery = dealsQuery.sort({ rating: -1 });
        
//         const deals = await dealsQuery.lean().exec();
//         const total = await Deal.countDocuments(query);
        
//         res.status(200).json({
//             success: true,
//             count: deals.length,
//             total,
//             page: pageNum,
//             limit: limitNum,
//             totalPages: Math.ceil(total / limitNum),
//             data: deals
//         });
//     } catch (error: any) {
//         console.error('Error in getAllDeals:', error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// deal-service/controllers/deal.ts
export const getAllDeals = async (req: AuthRequest, res: Response) => {
  try {
    const { category, minPrice, maxPrice, sort, offerType, holidayStyle, destinationId, page = 1, limit = 10 } = req.query;
    
    let query: any = {};
    if (category) query.category = category;
    if (offerType) query.offerType = offerType;
    if (holidayStyle) query.holidayStyle = holidayStyle;
    if (destinationId && mongoose.Types.ObjectId.isValid(destinationId as string)) {
      query.destinationId = destinationId;
    }
    if (minPrice || maxPrice) {
      query.discountedPrice = {};
      if (minPrice) query.discountedPrice.$gte = Number(minPrice);
      if (maxPrice) query.discountedPrice.$lte = Number(maxPrice);
    }
    
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;
    
    let dealsQuery = Deal.find(query).skip(skip).limit(limitNum);
    
    if (sort === 'price_asc') dealsQuery = dealsQuery.sort({ discountedPrice: 1 });
    else if (sort === 'price_desc') dealsQuery = dealsQuery.sort({ discountedPrice: -1 });
    else if (sort === 'rating') dealsQuery = dealsQuery.sort({ rating: -1 });
    
    const deals = await dealsQuery.lean().exec();
    const total = await Deal.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: deals.length,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: deals
    });
  } catch (error: any) {
    console.error('Error in getAllDeals:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single deal
// export const getDealById = async (req: AuthRequest, res: Response) => {
//     try {
//         const deal = await Deal.findById(req.params.id).populate('hotelId');
//         if (!deal) {
//             return res.status(404).json({ success: false, error: 'Deal not found' });
//         }
//         res.json({ success: true, data: deal });
//     } catch (error: any) {
//         res.status(500).json({ success: false, error: error.message || 'Failed to fetch deal' });
//     }
// };

// deal-service/controllers/deal.ts

// export const getDealById = async (req: AuthRequest, res: Response) => {
//   try {
//     const { id } = req.params;

//     // 1. Validate MongoDB ObjectId format
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(404).json({ success: false, error: 'Deal not found' });
//     }

//     // 2. Fetch deal and populate hotelId
//     const deal = await Deal.findById(id).populate('hotelId').lean();

//     if (!deal) {
//       return res.status(404).json({ success: false, error: 'Deal not found' });
//     }

//     res.json({ success: true, data: deal });
//   } catch (error: any) {
//     console.error('Error in getDealById:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
// export const getDealById = async (req: AuthRequest, res: Response) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(404).json({ success: false, error: 'Deal not found' });
//     }

//     const deal = await Deal.findById(id)
//       .populate('hotelId')
//       .lean();

//     if (!deal) {
//       return res.status(404).json({ success: false, error: 'Deal not found' });
//     }

//     res.json({ success: true, data: deal });
//   } catch (error: any) {
//     console.error('Error in getDealById:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

export const getDealById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, error: 'Deal not found' });
    }

    // 2. Fetch without population first to see if it's a population issue
    const deal = await Deal.findById(id).lean();
    if (!deal) {
      return res.status(404).json({ success: false, error: 'Deal not found' });
    }

    // 3. If population is needed, do it separately (or use .populate('hotelId') with error handling)
    let populatedDeal = deal;
    if (deal.hotelId) {
      try {
        // Use mongoose's populate on a separate query or re-fetch
        const fullDeal = await Deal.findById(id).populate('hotelId').lean();
        if (fullDeal) populatedDeal = fullDeal;
      } catch (popErr) {
        console.warn('Population failed, returning unpopulated deal:', popErr);
      }
    }

    res.json({ success: true, data: populatedDeal });
  } catch (error: any) {
    console.error('Error in getDealById:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
// Create deal (admin only)
export const createDeal = async (req: AuthRequest, res: Response) => {
    try {
        const discountPercent = ((req.body.originalPrice - req.body.discountedPrice) / req.body.originalPrice) * 100;
        const dealData = {
            ...req.body,
            discountPercent: Number(discountPercent.toFixed(2))
        };
        
        const deal = await Deal.create(dealData);
        
        // Publish to queue
        const channel = getChannel();
        if (channel) {
            channel.sendToQueue('DEAL_QUEUE', Buffer.from(JSON.stringify({
                type: 'DEAL_CREATED',
                dealId: deal._id,
                hotelId: deal.hotelId,
                timestamp: new Date()
            })));
        }
        
        res.status(201).json({ success: true, data: deal });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to create deal' });
    }
};

// Update deal
export const updateDeal = async (req: AuthRequest, res: Response) => {
    try {
        let updateData: any = { ...req.body, updatedAt: new Date() };
        
        // Recalculate discount if prices changed
        if (req.body.originalPrice && req.body.discountedPrice) {
            updateData.discountPercent = Number((((req.body.originalPrice - req.body.discountedPrice) / req.body.originalPrice) * 100).toFixed(2));
        }
        
        const deal = await Deal.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
        if (!deal) {
            return res.status(404).json({ success: false, error: 'Deal not found' });
        }
        
        res.json({ success: true, data: deal });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to update deal' });
    }
};

// Delete deal
export const deleteDeal = async (req: AuthRequest, res: Response) => {
    try {
        const deal = await Deal.findByIdAndDelete(req.params.id);
        
        if (!deal) {
            return res.status(404).json({ success: false, error: 'Deal not found' });
        }
        
        res.json({ success: true, message: 'Deal deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to delete deal' });
    }
};

// Search deals
export const searchDeals = async (req: AuthRequest, res: Response) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, error: 'Search query required' });
        }
        
        const deals = await Deal.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ],
            status: 'active'
        }).populate('hotelId');
        
        res.json({ success: true, data: deals });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to search deals' });
    }
};

// Add review to deal
export const addReview = async (req: AuthRequest, res: Response) => {
    try {
        const { rating, comment } = req.body;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
        }
        
        const deal = await Deal.findById(req.params.id);
        
        if (!deal) {
            return res.status(404).json({ success: false, error: 'Deal not found' });
        }
        
        // Check if user already reviewed
        const existingReview = deal.reviews.find(
            review => review.userId?.toString() === req.userId
        );
        
        if (existingReview) {
            return res.status(400).json({ success: false, error: 'You have already reviewed this deal' });
        }
        
        deal.reviews.push({
            userId: req.userId as any,
            rating: Number(rating),
            comment,
            createdAt: new Date()
        });
        
        // Update average rating - FIXED: filter out undefined ratings
        const validRatings = deal.reviews.filter(review => review.rating !== undefined);
        const totalRating = validRatings.reduce((sum, review) => sum + (review.rating || 0), 0);
        deal.rating = totalRating / validRatings.length;
        
        await deal.save();
        res.json({ success: true, data: deal });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to add review' });
    }
};

// Get featured deals
export const getFeaturedDeals = async (req: AuthRequest, res: Response) => {
    try {
        const filter = { 
            status: 'active', 
            endDate: { $gte: new Date() } 
        };
        const deals = await Deal.find(filter)
            .sort({ rating: -1, currentBookings: -1 })
            .limit(6)
            .populate('hotelId', 'name city rating images');
        
        res.json({ success: true, data: deals });
    } catch (error: any) {
        console.error('Featured deals error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch featured deals' });
    }
};
// Get featured deals
// export const getFeaturedDeals = async (req: AuthRequest, res: Response) => {
//     try {
//         // const deals = await Deal.find({ status: 'active', endDate: { $gte: new Date() } })
//         //     .sort({ rating: -1, currentBookings: -1 })
//         //     .limit(6)
//         //     .populate('hotelId');
//         const deals = await Deal.find(query)
//     .sort({ rating: -1, currentBookings: -1 })
//     .limit(6)
//     .populate('hotelId', 'name city rating images');
//         res.json({ success: true, data: deals });
//     } catch (error: any) {
//         res.status(500).json({ success: false, error: error.message || 'Failed to fetch featured deals' });
//     }
// };

// Increment bookings (called by booking service)
export const incrementBookings = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const deal = await Deal.findByIdAndUpdate(
            id,
            { $inc: { currentBookings: 1 } },
            { new: true }
        );
        
        if (!deal) {
            return res.status(404).json({ success: false, error: 'Deal not found' });
        }
        
        res.json({ success: true, data: deal });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message || 'Failed to increment bookings' });
    }
};

export const getAllDestinations = async (req: AuthRequest, res: Response) => {
  const destinations = await Destination.find().sort({ name: 1 });
  res.json({ success: true, data: destinations });
};

export const getFeaturedDestination = async (req: AuthRequest, res: Response) => {
  const featured = await Destination.findOne({ featured: true })
    .populate('deals')   // optionally populate deals
    .lean();
  res.json({ success: true, data: featured });
};
 
