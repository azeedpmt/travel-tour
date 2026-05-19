import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../model/user';

export const setupGoogleAuth = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL 
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            
            if (!user) {
                // Check if user exists with same email
                const existingUser = await User.findOne({ email: profile.emails?.[0].value });
                if (existingUser) {
                    // Link Google account to existing user
                    existingUser.googleId = profile.id;
                    existingUser.avatar = profile.photos?.[0].value;
                    await existingUser.save();
                    return done(null, existingUser);
                }
                
                // Create new user - Default role is 'user'
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails?.[0].value,
                    name: profile.displayName,
                    avatar: profile.photos?.[0].value,
                    isVerified: true,
                    role: 'user' // Default role
                });
            }
            
            return done(null, user);
        } catch (error) {
            return done(error as Error);
        }
    }));
};


