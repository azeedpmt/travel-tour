import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupRabbitMQ } from './config/rabbitmq';
import paymentRoutes from './routes/payment';

dotenv.config();

const app = express();
setupRabbitMQ();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Payment Service', timestamp: new Date() });
});

// Routes
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Payment Service running on port ${PORT}`));