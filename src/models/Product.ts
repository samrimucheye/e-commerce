import mongoose, { Schema, Model, Document } from 'mongoose';
import './Category'; // Ensure Category is registered

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    discount: number;
    stock: number;
    category: mongoose.Types.ObjectId;
    images: string[];
    externalId?: string;
    source?: string;
    variants: {
        type: string; // e.g., 'Size', 'Color'
        value: string; // e.g., 'M', 'Red'
        priceAdjustment?: number;
        stock?: number;
        image?: string;
    }[];
    isFeatured: boolean;
    isNewArrival: boolean;
    isOnSale: boolean;
    salePrice?: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        stock: { type: Number, required: true, default: 0 },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        images: [{ type: String }],
        externalId: { type: String },
        source: { type: String, default: 'local' },
        variants: [
            {
                type: { type: String, required: true },
                value: { type: String, required: true },
                priceAdjustment: { type: Number, default: 0 },
                stock: { type: Number, default: 0 },
                image: { type: String }
            },
        ],
        isFeatured: { type: Boolean, default: false },
        isNewArrival: { type: Boolean, default: false },
        isOnSale: { type: Boolean, default: false },
        salePrice: { type: Number },
    },
    { timestamps: true }
);

// Indexes for search and optimization
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
