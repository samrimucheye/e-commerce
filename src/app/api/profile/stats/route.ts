import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Get user data
        const user = await User.findById(session.user.id).populate('wishlist');

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Get order statistics - handle case where user has no orders
        let orders: any[] = [];
        let totalOrders = 0;
        let totalSpent = 0;
        let recentOrders: Array<{
            _id: string;
            orderNumber: string;
            totalAmount: number;
            status: string;
            createdAt: Date;
        }> = [];

        try {
            orders = await Order.find({ user: session.user.id });
            totalOrders = orders.length;
            totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

            // Get recent orders (last 3)
            recentOrders = orders
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 3)
                .map(order => ({
                    _id: order._id.toString(),
                    orderNumber: order._id.toString().slice(-8).toUpperCase(),
                    totalAmount: order.totalAmount || 0,
                    status: order.status || 'pending',
                    createdAt: order.createdAt,
                }));
        } catch (orderError) {
            console.log('No orders found for user, using defaults');
        }

        // Get wishlist count - handle case where wishlist is empty
        const wishlistCount = user.wishlist?.length || 0;

        // Calculate account age in days
        const accountAge = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));

        return NextResponse.json({
            stats: {
                totalOrders,
                totalSpent,
                wishlistCount,
                accountAge,
            },
            recentOrders,
        });

    } catch (error: any) {
        console.error("Profile stats error:", error);
        return NextResponse.json({
            message: error.message || "Failed to fetch profile stats"
        }, { status: 500 });
    }
}

