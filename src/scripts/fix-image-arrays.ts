
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

// Simple Product Schema for the migration
const ProductSchema = new mongoose.Schema({
    name: String,
    images: [String],
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function fixImageArrays() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Found ${products.length} products to check`);

        let fixedCount = 0;

        for (const product of products) {
            let needsSave = false;
            const newImages: string[] = [];

            if (product.images && Array.isArray(product.images)) {
                for (const img of product.images) {
                    if (typeof img === 'string' && img.trim().startsWith('[') && img.trim().endsWith(']')) {
                        try {
                            const parsed = JSON.parse(img);
                            if (Array.isArray(parsed)) {
                                console.log(`Fixing product ${product.name} (${product._id})`);
                                newImages.push(...parsed);
                                needsSave = true;
                            } else {
                                newImages.push(img);
                            }
                        } catch (e) {
                            newImages.push(img);
                        }
                    } else {
                        newImages.push(img);
                    }
                }
            }

            if (needsSave) {
                // Remove duplicates and filter empty
                product.images = [...new Set(newImages)].filter(i => i);
                await product.save();
                fixedCount++;
                console.log(`Saved product ${product._id}`);
            }
        }

        console.log(`Migration complete. Fixed ${fixedCount} products.`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

fixImageArrays();
