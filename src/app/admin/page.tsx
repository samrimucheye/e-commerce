import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { DollarSign, Package, Users, ShoppingCart, ArrowUpRight, TrendingUp } from "lucide-react";
import SalesChart from "@/components/admin/SalesChart";
import CategoryChart from "@/components/admin/CategoryChart";
import AnimatedSection from "@/components/animations/AnimatedSection";
import DownloadReportButton from "@/components/admin/DownloadReportButton";

// Ensure model is registered
import "@/models/Category";

async function getStats() {
    await dbConnect();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const orders = await Order.find({ isPaid: true }).sort({ createdAt: 1 });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Format data for chart (Group by day) - Take last 7 days or all if less
    const salesDataMap = orders.reduce((acc: any, order) => {
        const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        acc[date] = (acc[date] || 0) + order.totalAmount;
        return acc;
    }, {});

    const salesData = Object.entries(salesDataMap).map(([date, amount]) => ({ date, amount }));

    // Aggregate category distribution
    const products = await Product.find({}).populate('category');
    const categoryMap = products.reduce((acc: any, product: any) => {
        const catName = product.category?.name || 'Uncategorized';
        acc[catName] = (acc[catName] || 0) + 1;
        return acc;
    }, {});
    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value: value as number }));

    // Get last 5 orders
    const recentOrders = await Order.find({})
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

    return { totalOrders, totalProducts, totalUsers, totalRevenue, salesData, categoryData, recentOrders: JSON.parse(JSON.stringify(recentOrders)) };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-6 lg:space-y-10 pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 font-medium mt-1">Welcome back. Here's what's happening today.</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <DownloadReportButton />
                    <button className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 rounded-2xl text-sm font-black text-white hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-600/20">
                        Manage Orders
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'emerald', trend: '+12.5%' },
                    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'indigo', trend: '+8.2%' },
                    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'rose', trend: '+3.1%' },
                    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'amber', trend: '+15.4%' },
                ].map((stat, idx) => (
                    <AnimatedSection key={stat.label} delay={idx * 0.1}>
                        <div className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-4 bg-${stat.color}-50 dark:bg-${stat.color}-500/10 rounded-2xl text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3" /> {stat.trend}
                                </div>
                            </div>
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
                        </div>
                    </AnimatedSection>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SalesChart data={stats.salesData} />
                </div>
                <div className="h-full">
                    <CategoryChart data={stats.categoryData} />
                </div>
            </div>

            {/* Recent Orders Section */}
            <AnimatedSection direction="up" delay={0.4}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recent Activity</h2>
                            <button className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1">
                                View all <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {stats.recentOrders.map((order: any) => (
                                <div key={order._id} className="flex items-center justify-between py-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 -mx-4 px-4 rounded-2xl transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-500 text-xs">
                                            #{order._id.slice(-4).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                {order.user?.name || 'Guest User'}
                                            </p>
                                            <p className="text-xs text-slate-400 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base font-black text-slate-900 dark:text-white">${order.totalAmount.toFixed(2)}</p>
                                        <span className={`inline-block mt-1 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${order.isPaid ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                                            {order.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-indigo-600 p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-600/30 text-white relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-0 right-0 p-8 opacity-20">
                            <TrendingUp className="w-32 h-32 rotate-12" />
                        </div>
                        <h3 className="text-2xl font-black mb-4 relative z-10">Sales Intelligence</h3>
                        <p className="text-indigo-100 font-medium mb-8 relative z-10">Your growth is up 12% compared to last month. Keep up the great work!</p>
                        <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black shadow-xl hover:bg-indigo-50 transition-colors relative z-10">
                            View Insights
                        </button>
                    </div>
                </div>
            </AnimatedSection>
        </div>
    );
}
