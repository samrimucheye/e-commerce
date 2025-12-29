import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { DollarSign, Package, Users, ShoppingCart } from "lucide-react";
import SalesChart from "@/components/admin/SalesChart";

async function getStats() {
    await dbConnect();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const orders = await Order.find({ isPaid: true }).sort({ createdAt: 1 });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Format data for chart (Group by day)
    const salesDataMap = orders.reduce((acc: any, order) => {
        const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        acc[date] = (acc[date] || 0) + order.totalAmount;
        return acc;
    }, {});

    const salesData = Object.entries(salesDataMap).map(([date, amount]) => ({ date, amount }));

    // Get last 5 orders
    const recentOrders = await Order.find({})
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

    return { totalOrders, totalProducts, totalUsers, totalRevenue, salesData, recentOrders: JSON.parse(JSON.stringify(recentOrders)) };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full text-green-600">
                            <DollarSign className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                            <ShoppingCart className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Products</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                            <Package className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-full text-orange-600">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SalesChart data={stats.salesData} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Orders</h2>
                    <div className="space-y-4">
                        {stats.recentOrders.map((order: any) => (
                            <div key={order._id} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">#{order._id.slice(-6)}</p>
                                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                                    <p className={`text-[10px] uppercase font-bold tracking-wider ${order.isPaid ? 'text-green-500' : 'text-yellow-500'}`}>
                                        {order.isPaid ? 'Paid' : 'Pending'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
