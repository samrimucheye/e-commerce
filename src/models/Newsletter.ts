import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INewsletter extends Document {
    email: string;
    subscribedAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        }
    },
    { timestamps: { createdAt: 'subscribedAt', updatedAt: false } }
);

const Newsletter: Model<INewsletter> =
    mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);

export default Newsletter;
