import mongoose from 'mongoose';
import {BookingStats} from '../models/BookingStats'
export const connectDB = async () => {
    try {
         const options = {
            tlsAllowInvalidCertificates: true, // ✅ bypass certificate validation
            retryWrites: true,
            w: 'majority'
        };
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Realtime Service DB Connected');
        
        // Initialize default stats if not exists
        await initializeStats();
    } catch (error) {
        console.error('DB Connection Error:', error);
        process.exit(1);
    }
};

const initializeStats = async () => {
    const stats = ['total_bookings', 'active_bookings', 'total_revenue'];
    for (const stat of stats) {
        await BookingStats.findOneAndUpdate(
            { metric: stat },
            { metric: stat, value: 0 },
            { upsert: true, new: true }
        );
    }
};
