import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: 'user' | 'admin';
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false },
        image: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        address: { type: String },
        city: { type: String },
        postalCode: { type: String },
        country: { type: String },
    },
    { timestamps: true }
);

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
