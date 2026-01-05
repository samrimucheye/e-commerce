import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        await dbConnect();

        // Get total count
        const total = await Order.countDocuments({ user: session.user.id });

        // Get orders with pagination
        const orders = await Order.find({ user: session.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('items.product', 'name images slug')
            .lean();

        // Format orders for client
        const formattedOrders = orders.map(order => ({
            _id: order._id.toString(),
            orderNumber: (order as any).orderNumber || order._id.toString().slice(-8).toUpperCase(),
            totalAmount: order.totalAmount,
            status: order.status,
            paymentStatus: (order as any).paymentStatus || (order.isPaid ? 'Paid' : 'Unpaid'),
            items: order.items?.map((item: any) => ({
                product: {
                    _id: item.product?._id?.toString(),
                    name: item.product?.name,
                    image: item.product?.images?.[0],
                    slug: item.product?.slug,
                },
                quantity: item.quantity,
                price: item.price,
            })) || [],
            shippingAddress: order.shippingAddress,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        }));

        return NextResponse.json({
            orders: formattedOrders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (error: any) {
        console.error("Orders fetch error:", error);
        return NextResponse.json({
            message: error.message || "Failed to fetch orders"
        }, { status: 500 });
    }
}
