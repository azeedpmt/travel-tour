import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { setupRabbitMQ } from './config/rabbitmq';
import dealRoutes from './routes/deal';

dotenv.config();

const app = express();
connectDB();
setupRabbitMQ();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Deal Service', timestamp: new Date() });
});

// Routes
app.use('/api/deals', dealRoutes);

const PORT = process.env.PORT || 8003;
app.listen(PORT, () => console.log(`Deal Service running on port ${PORT}`));
