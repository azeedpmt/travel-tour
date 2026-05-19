import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

// Configure CORS properly
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Apply CORS middleware first
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security + logging
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(morgan('combined'));


// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'API Gateway', 
        timestamp: new Date(),
        services: {
            auth: 'http://localhost:8001',
            booking: 'http://localhost:8002',
            deal: 'http://localhost:8003',
            hotel: 'http://localhost:8004',
            food: 'http://localhost:8005',
            payment: 'http://localhost:8006',
            realtime: 'http://localhost:8007',
            admin: 'http://localhost:8008'
        }
    });
});

// ✅ FIXED PROXY (BODY FORWARDING ADDED)
const createProxy = (target: string) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    timeout: 30000,
    proxyTimeout: 30000,

    onProxyReq: (proxyReq, req: any) => {
      proxyReq.setHeader('Origin', req.headers.origin || '');

      // 🔥 CRITICAL FIX: forward body properly
      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },

    onProxyRes: (proxyRes) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173';
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    },
  });
};

// Service proxies (UNCHANGED)
app.use('/api/auth', createProxy(process.env.AUTH_SERVICE_URL || 'http://localhost:8001'));
app.use('/api/bookings', createProxy(process.env.BOOKING_SERVICE_URL || 'http://localhost:8002'));
app.use('/api/deals', createProxy(process.env.DEAL_SERVICE_URL || 'http://localhost:8003'));
app.use('/api/hotels', createProxy(process.env.HOTEL_SERVICE_URL || 'http://localhost:8005'));
app.use('/api/food', createProxy(process.env.FOOD_SERVICE_URL || 'http://localhost:8004'));
app.use('/api/payments', createProxy(process.env.PAYMENT_SERVICE_URL || 'http://localhost:8006'));
app.use('/api/realtime', createProxy(process.env.REALTIME_SERVICE_URL || 'http://localhost:8007'));
app.use('/api/admin', createProxy(process.env.ADMIN_SERVICE_URL || 'http://localhost:8008'));

// ✅ NOW SAFE to use body parser AFTER proxy
app.use(express.json());

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Gateway error:', err);
    res.status(500).json({ success: false, error: 'Internal gateway error' });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    console.log(`CORS enabled for origins: http://localhost:5173`);
});