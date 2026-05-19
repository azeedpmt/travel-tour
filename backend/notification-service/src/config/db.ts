import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
         const options = {
            tlsAllowInvalidCertificates: true, // ✅ bypass certificate validation
            retryWrites: true,
            w: 'majority'
        };
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Notification Service DB Connected');
    } catch (error) {
        console.error('DB Connection Error:', error);
        process.exit(1);
    }
};