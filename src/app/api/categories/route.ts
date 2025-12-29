import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import { auth } from '@/auth';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const categories = await Category.find({}).sort('name');
        return NextResponse.json(categories);
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error fetching categories', error: error.message },
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

        const category = await Category.create(body);

        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ message: 'Category already exists' }, { status: 400 });
        }
        return NextResponse.json(
            { message: 'Error creating category', error: error.message },
            { status: 500 }
        );
    }
}
