import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { setupRabbitMQ } from './config/rabbitmq';
import hotelRoutes from './routes/hotel';

dotenv.config();

const app = express();
connectDB();
setupRabbitMQ();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Hotel Service', timestamp: new Date() });
});

// Routes
app.use('/api/hotels', hotelRoutes);

const PORT = process.env.PORT || 8004;
app.listen(PORT, () => console.log(`Hotel Service running on port ${PORT}`));