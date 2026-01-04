import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { auth } from '@/auth';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12'); // Standard grid size
        const sort = searchParams.get('sort') || '-createdAt';
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const skip = (page - 1) * limit;

        const query: any = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$text = { $search: search };
        }

        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('category', 'name slug');

        const total = await Product.countDocuments(query);

        return NextResponse.json({
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error fetching products', error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        const userRole = (session?.user as any)?.role;

        if (!session || userRole !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // Validate Category ID to prevent CastError
        if (!body.category || body.category === "") {
            return NextResponse.json({ message: 'Category is required' }, { status: 400 });
        }

        // Quick validation could be added here or via Zod
        const product = await Product.create(body);

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error('❌ Error creating product:', error);

        if (error.code === 11000) {
            return NextResponse.json(
                { message: 'A product with this slug/name already exists.', error: 'Duplicate key error' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Error creating product', error: error.message },
            { status: 500 }
        );
    }
}
