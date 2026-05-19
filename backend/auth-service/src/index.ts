import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import authRoutes from './routes/auth';

const app = express();
const PORT = process.env.PORT || 8001;

// Allow direct calls from frontend
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:9000'],
    credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI!)
    .then(() => console.log('Auth Service DB Connected'))
    .catch((error) => console.error('DB Connection Error:', error));

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Auth Service', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});
// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import authRoutes from './routes/auth';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 8001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI!)
//     .then(() => console.log('Auth Service DB Connected'))
//     .catch((error) => console.error('DB Connection Error:', error));

// // Routes
// app.use('/api/auth', authRoutes);

// // Health check
// app.get('/health', (req, res) => {
//     res.json({ status: 'OK', service: 'Auth Service', timestamp: new Date() });
// });

// app.listen(PORT, () => {
//     console.log(`Auth Service running on port ${PORT}`);
// });


// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import passport from 'passport';
// import { connectDB } from './config/db';
// import { setupGoogleAuth } from './config/passport';  // Import this
// import authRoutes from './routes/auth';

// dotenv.config();

// const app = express();
// connectDB();
// setupGoogleAuth();  // Call this to initialize Google auth

// app.use(cors());
// app.use(express.json());
// app.use(passport.initialize());  // Initialize passport

// // Health check
// app.get('/health', (req, res) => {
//     res.json({ status: 'OK', service: 'Auth Service', timestamp: new Date() });
// });

// // Routes
// app.use('/api/auth', authRoutes);

// const PORT = process.env.PORT || 8001;
// app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));



// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import passport from 'passport';
// import { connectDB } from './config/db';
// import { setupGoogleAuth } from './googleConfig';
// import authRoutes from './routes/auth';

// dotenv.config();

// const app = express();
// connectDB();
// setupGoogleAuth();

// // CORS configuration
// const corsOptions = {
//   origin: ['http://localhost:5173', 'http://localhost:9000', 'http://localhost:8001'],
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// app.use(express.json());
// app.use(passport.initialize());

// // Health check
// app.get('/health', (req, res) => {
//     res.json({ status: 'OK', service: 'Auth Service', timestamp: new Date() });
// });

// // Routes
// app.use('/api/auth', authRoutes);

// const PORT = process.env.PORT || 8001;
// app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));





// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import passport from 'passport';
// import { connectDB } from './config/db';
// import { setupGoogleAuth } from './googleConfig';
// import authRoutes from './routes/auth';

// dotenv.config();

// const app = express();
// connectDB();
// setupGoogleAuth();

// app.use(cors());
// app.use(express.json());
// app.use(passport.initialize());

// // Health check
// app.get('/health', (req, res) => {
//     res.json({ status: 'OK', service: 'Auth Service', timestamp: new Date() });
// });

// // Routes
// app.use('/api/auth', authRoutes);

// const PORT = process.env.PORT || 8001;
// app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));