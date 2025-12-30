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
UserSchema.pre('save', function (this: any, next: any) {
    if (!this.isModified('password') || !this.password) {
        return typeof next === 'function' ? next() : Promise.resolve();
    }

    const user = this;
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return typeof next === 'function' ? next(err) : Promise.reject(err);
        bcrypt.hash(user.password!, salt!, (err, hash) => {
            if (err) return typeof next === 'function' ? next(err) : Promise.reject(err);
            user.password = hash;
            if (typeof next === 'function') next();
        });
    });
});

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
