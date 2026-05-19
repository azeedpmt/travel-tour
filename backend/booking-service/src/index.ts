import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { setupRabbitMQ } from './config/rabbitmq';
import bookingRoutes from './routes/booking';

dotenv.config();

const app = express();
connectDB();
setupRabbitMQ();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Booking Service', timestamp: new Date() });
});

// Routes
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => console.log(`Booking Service running on port ${PORT}`));
