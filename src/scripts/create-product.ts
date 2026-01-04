
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
    try {
        const { default: dbConnect } = await import('../lib/db');
        const { default: Product } = await import('../models/Product');

        await dbConnect();
        console.log('Connected to database.');

        const productData = {
            name: "Wireless Bluetooth Headphones",
            slug: "wireless-bluetooth-headphones-" + Date.now(),
            description: "High-quality wireless Bluetooth headphones with noise cancellation and long battery life.",
            price: 79.99,
            discount: 10,
            stock: 120,
            category: "6952d6de93e0134be2fbe553", // Using valid category ID found
            images: [
                "https://example.com/images/headphone-1.jpg",
                "https://example.com/images/headphone-2.jpg"
            ],
            externalId: "CJ-HP-001",
            source: "cjdropshipping",
            variants: [
                {
                    type: "Color",
                    value: "Black",
                    priceAdjustment: 0,
                    stock: 60
                },
                {
                    type: "Color",
                    value: "White",
                    priceAdjustment: 5,
                    stock: 60
                }
            ],
            isFeatured: true,
            isNewArrival: true,
            isOnSale: true,
            salePrice: 69.99
        };

        const product = await Product.create(productData);
        console.log('✅ Product created successfully:', product._id);
        console.log(product);

    } catch (error) {
        console.error('❌ Error creating product:', error);
    } finally {
        await mongoose.disconnect();
    }
}

main();
