// ============================================================
// REPLACE the isAuth middleware in ALL of these services:
//   - booking-service/middlewares/isAuth.ts
//   - deal-service/middlewares/isAuth.ts
//   - food-service/middlewares/isAuth.ts
//   - hotel-service/middlewares/isAuth.ts
//   - admin-service/middlewares/isAuth.ts
//   - payment-service/middlewares/isAuth.ts
// ============================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}

export const isAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

        // FIX: auth-service signs as jwt.sign({ user }, secret)
        // so decoded = { user: { _id, role, email, ... } }
        // NOT decoded.userId / decoded.role directly
        req.userId = decoded.user?._id || decoded.userId;
        req.userRole = decoded.user?.role || decoded.role;

        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    next();
};