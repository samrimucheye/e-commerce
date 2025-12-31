import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

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
    wishlist: mongoose.Types.ObjectId[];
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
        wishlist: { type: [{ type: Schema.Types.ObjectId, ref: 'Product' }], default: [] },
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (this: any) {
    if (!this.isModified('password') || !this.password) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
