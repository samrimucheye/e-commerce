import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth() as any;
        if (!session || session.user?.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await dbConnect();

        const orders = await Order.find({ isPaid: true })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        const reportData = {
            generatedAt: new Date().toISOString(),
            totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
            totalOrders: orders.length,
            orders: orders.map((order: any) => ({
                id: order._id.toString(),
                date: new Date(order.createdAt).toLocaleDateString(),
                customerName: order.user?.name || "Guest",
                customerEmail: order.user?.email || "N/A",
                amount: order.totalAmount,
                status: order.isPaid ? "Paid" : "Pending"
            }))
        };

        return NextResponse.json(reportData);

    } catch (error) {
        console.error("REPORT_GENERATION_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
