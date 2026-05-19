import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { setupRabbitMQ } from './config/rabbitmq';
import foodRoutes from './routes/food';

dotenv.config();

const app = express();
connectDB();
setupRabbitMQ();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Food Service', timestamp: new Date() });
});

// Routes
app.use('/api/food', foodRoutes);

const PORT = process.env.PORT || 8005;
app.listen(PORT, () => console.log(`Food Service running on port ${PORT}`));
