import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin' | null;
    isVerified?: boolean;
}

export const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Please Login - No auth header" });
            return;
        }
        
        const token = authHeader.split(" ")[1];
        
        if (!token) {
            res.status(401).json({ message: "Please Login - Token missing" });
            return;
        }
        
        const decodedValue = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        
        if (!decodedValue || !decodedValue.user) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        
        // Attach to request object
        (req as any).user = decodedValue.user;
        (req as any).userId = decodedValue.user._id;
        (req as any).userRole = decodedValue.user.role;
        next();
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!(req as any).user) {
            res.status(401).json({ message: "Please Login" });
            return;
        }
        
        if ((req as any).user.role !== "admin") {
            res.status(403).json({ message: "Access denied. Admin only." });
            return;
        }
        
        next();
    } catch (error) {
        res.status(401).json({ message: "Please Login" });
    }
};