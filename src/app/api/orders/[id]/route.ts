import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { auth } from '@/auth';

export async function GET(
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
        const order = await Order.findById(id).populate('user', 'name email');

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error fetching order', error: error.message },
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
        const { status, isPaid, isDelivered } = await req.json();

        const update: any = {};
        if (status) update.status = status;
        if (typeof isPaid !== 'undefined') {
            update.isPaid = isPaid;
            if (isPaid) update.paidAt = new Date();
        }
        if (typeof isDelivered !== 'undefined') {
            update.isDelivered = isDelivered;
            if (isDelivered) update.deliveredAt = new Date();
            if (isDelivered) update.status = 'delivered';
        }

        const order = await Order.findByIdAndUpdate(id, update, { new: true });

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error updating order', error: error.message },
            { status: 500 }
        );
    }
}
