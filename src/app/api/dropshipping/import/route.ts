import { NextResponse } from 'next/server';
import { cj } from '@/lib/cj';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { auth } from '@/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { pid, categoryId } = await req.json();
        if (!pid) return NextResponse.json({ message: 'Product ID required' }, { status: 400 });

        await dbConnect();

        // 1. Fetch details from CJ
        const cjProduct = await cj.getProductDetail(pid);

        if (!cjProduct) throw new Error('Product details not found in CJ');

        // Log the product data to debug image URLs
        console.log('CJ Product Image:', cjProduct.productImage);

        // 2. Map to internal Product model
        // Note: We use a default category if none provided, or look up/create one
        let targetCategory = categoryId;
        if (!targetCategory) {
            const defaultCategory = await Category.findOne({ slug: 'general' });
            if (defaultCategory) {
                targetCategory = defaultCategory._id;
            } else {
                const newCat = await Category.create({ name: 'General', slug: 'general' });
                targetCategory = newCat._id;
            }
        }

        // Helper to parse images
        let images: string[] = [];
        if (typeof cjProduct.productImage === 'string') {
            try {
                // Try parsing if it looks like a JSON array
                if (cjProduct.productImage.trim().startsWith('[')) {
                    images = JSON.parse(cjProduct.productImage);
                } else {
                    images = [cjProduct.productImage];
                }
            } catch (e) {
                // If parse fails, assume it's a single URL
                images = [cjProduct.productImage];
            }
        } else if (Array.isArray(cjProduct.productImage)) {
            images = cjProduct.productImage;
        }

        const newProduct = {
            name: cjProduct.productNameEn,
            slug: cjProduct.productNameEn.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            description: cjProduct.description || cjProduct.productNameEn,
            price: cjProduct.sellPrice || 0,
            stock: 100, // CJ products usually imply virtual stock or we can fetch real stock
            images: images,
            category: targetCategory,
            externalId: pid,
            source: 'cjdropshipping'
        };

        const product = await Product.create(newProduct);

        return NextResponse.json({ message: 'Product imported successfully', product });
    } catch (error: any) {
        console.error('CJ Import Error:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
