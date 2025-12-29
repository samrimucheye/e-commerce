import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import { auth } from '@/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await dbConnect();
        const category = await Category.findById(id);

        if (!category) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error fetching category', error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await auth();
        const userRole = (session?.user as any)?.role;

        if (!session || userRole !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        const category = await Category.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!category) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error updating category', error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await auth();
        const userRole = (session?.user as any)?.role;

        if (!session || userRole !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Category deleted' });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error deleting category', error: error.message },
            { status: 500 }
        );
    }
}
