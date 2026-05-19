import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Admin Service', timestamp: new Date() });
});

// Admin routes
app.use('/api/admin', adminRoutes);

// Global error handler (must be AFTER routes)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 8008;
app.listen(PORT, () => console.log(`Admin Service running on port ${PORT}`));