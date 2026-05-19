import mongoose from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin' | null;
    googleId?: string;
    isVerified: boolean;
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    googleId: { type: String },
    role: { type: String, enum: ['user', 'admin', null], default: null },
    isVerified: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', userSchema);


// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     password: { type: String },
//     name: { type: String, required: true },
//     googleId: { type: String },
//     avatar: { type: String },
//     role: { type: String, enum: ['user', 'admin', 'hotel_owner', 'rider'], default: 'user' },
//     isVerified: { type: Boolean, default: false },
//     createdAt: { type: Date, default: Date.now }
// });

// export const User = mongoose.model('User', userSchema);

// import mongoose from 'mongoose';

// export const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     password: { type: String },
//     name: { type: String, required: true },
//     googleId: { type: String },
//     avatar: { type: String },
//     role: { type: String, enum: ['user', 'admin'], default: 'user' },
//     isVerified: { type: Boolean, default: false },
//     createdAt: { type: Date, default: Date.now }
// });

// export const User = mongoose.model('User', userSchema);