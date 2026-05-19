import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../model/user';
import axios from 'axios';
import { oauth2client } from '../config/googleConfig';


// export const loginUser = async (req: Request, res: Response) => {
//     try {
//         const { code } = req.body;
//         console.log("LOGIN ATTEMPT - code received:", code ? "YES" : "NO");
        
//         if (!code) {
//             return res.status(400).json({ message: "Authorization code is required" });
//         }
        
//         console.log("Exchanging code with Google...");
//         console.log("Redirect URI being used:", process.env.GOOGLE_CALLBACK_URL);
//          const googleRes = await oauth2client.getToken(code);

        
//          oauth2client.setCredentials(googleRes.tokens);
        
//         const userRes = await axios.get(
//             `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
//         );
        
//         const { email, name, picture } = userRes.data;
        
//         let user = await User.findOne({ email });
        
//         if (!user) {
//             user = await User.create({
//                 name,
//                 email,
//                 avatar: picture,
//                 role: null
//             });
//         }
        
//         const token = jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: "15d" });
        
//         res.status(200).json({
//             message: "Login Successful",
//             token,
//             user,
//         });
       
//         console.log("Google token exchange SUCCESS");
//         // ... rest of code
//     } catch (error: any) {
//         console.error("LOGIN ERROR:", error.message);
//         console.error("ERROR DETAILS:", error.response?.data || error);
//         res.status(500).json({ message: error.message || "Login failed" });
//     }
// };

// export const loginUser = async (req: Request, res: Response) => {
//     try {
//         const { code } = req.body;
        
//         if (!code) {
//             return res.status(400).json({ message: "Authorization code is required" });
//         }
        
//         const googleRes = await oauth2client.getToken(code);
//         oauth2client.setCredentials(googleRes.tokens);
        
//         const userRes = await axios.get(
//             `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
//         );
        
//         const { email, name, picture } = userRes.data;
        
//         let user = await User.findOne({ email });
        
//         if (!user) {
//             user = await User.create({
//                 name,
//                 email,
//                 avatar: picture,
//                 role: null
//             });
//         }
        
//         const token = jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: "15d" });
        
//         res.status(200).json({
//             message: "Login Successful",
//             token,
//             user,
//         });
//     } catch (error: any) {
//         console.error('Login error:', error);
//         res.status(500).json({ message: error.message || "Login failed" });
//     }
// };

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        
        console.log('Login attempt, code received:', !!code);
        
        if (!code) {
            return res.status(400).json({ message: "Authorization code is required" });
        }

        // Exchange code for tokens
        console.log('Exchanging code with Google...');
        const { tokens } = await oauth2client.getToken(code);
        console.log('Token exchange success');
        
        oauth2client.setCredentials(tokens);

        // Get user info from Google
        const userInfoResponse = await axios.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            { headers: { Authorization: `Bearer ${tokens.access_token}` } }
        );

        const { email, name, picture } = userInfoResponse.data;
        console.log('Got user info:', email);

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                avatar: picture,
                role: null
            });
            console.log('New user created');
        } else {
            console.log('Existing user found, role:', user.role);
        }

        const token = jwt.sign(
            { user },
            process.env.JWT_SECRET as string,
            { expiresIn: "15d" }
        );

        res.status(200).json({
            message: "Login Successful",
            token,
            user,
        });

    } catch (error: any) {
        console.error('Login error details:', error.message);
        console.error('Error response:', error.response?.data);
        res.status(500).json({ 
            message: error.message || "Login failed",
            details: error.response?.data
        });
    }
};

export const addUserRole = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const { role, adminSecret } = req.body;
        const allowedRoles = ['user', 'admin'];
        
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        
        // For admin role, verify admin secret key
        if (role === 'admin') {
            const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'admin123';
            if (!adminSecret || adminSecret !== ADMIN_SECRET_KEY) {
                return res.status(403).json({ message: "Invalid admin secret key" });
            }
        }
        
        const user = await User.findByIdAndUpdate(
            userId, 
            { role }, 
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const token = jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: "15d" });
        
        res.json({ user, token });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const myProfile = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Create user with null role
        const user = await User.create({
            name,
            email,
            role: null,
            isVerified: true
        });
        
        const token = jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: "15d" });
        
        res.status(201).json({
            message: "Registration Successful",
            token,
            user,
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message || "Registration failed" });
    }
};

// ========== TEST LOGIN (for Playwright E2E tests) ==========
export const testLogin = async (req: Request, res: Response) => {
    const { email, role, secretKey } = req.body;

    // Only allow in development or when TEST_MODE=true
    if (process.env.NODE_ENV !== 'development' && process.env.TEST_MODE !== 'true') {
        return res.status(403).json({ message: 'Test login not allowed' });
    }

    // Admin secret validation
    if (role === 'admin' && secretKey !== process.env.ADMIN_SECRET_KEY && secretKey !== 'admin123') {
        return res.status(401).json({ message: 'Invalid admin secret' });
    }

    try {
        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                email,
                name: email.split('@')[0],
                role: role === 'admin' ? 'admin' : 'user',
                isVerified: true,
                avatar: 'https://via.placeholder.com/40',
            });
            await user.save();
        } else {
            // Optionally update role for existing test users
            user.role = role === 'admin' ? 'admin' : 'user';
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    } catch (error: any) {
        console.error('Test login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// export const registerUser = async (req: Request, res: Response) => {
//     try {
//         const { name, email, password, role } = req.body;
        
//         // Check if user exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "User already exists" });
//         }
        
//         // Create user (in production, hash password)
//         const user = await User.create({
//             name,
//             email,
//             role: role || null,
//             isVerified: true
//         });
        
//         const token = jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: "15d" });
        
//         res.status(201).json({
//             message: "Registration Successful",
//             token,
//             user,
//         });
//     } catch (error: any) {
//         console.error('Registration error:', error);
//         res.status(500).json({ message: error.message || "Registration failed" });
//     }
// };