import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { ShoppingBag, Clock, CheckCircle, Package, XCircle } from "lucide-react";
import Link from "next/link";

async function getOrders() {
    await dbConnect();
    const orders = await Order.find({})
        .populate('user', 'name email text')
        .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(orders));
}

const statusColors: any = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'pending': return <Clock className="h-4 w-4 mr-1" />;
        case 'paid': return <CheckCircle className="h-4 w-4 mr-1" />;
        case 'shipped': return <Package className="h-4 w-4 mr-1" />;
        case 'delivered': return <CheckCircle className="h-4 w-4 mr-1" />;
        case 'cancelled': return <XCircle className="h-4 w-4 mr-1" />;
        default: return null;
    }
};

export default async function AdminOrdersPage() {
    const orders = await getOrders();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Orders</h1>
                    <p className="mt-1 text-gray-500 font-medium">Monitor and manage customer transactions.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {orders.map((order: any) => (
                                <tr key={order._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-black text-slate-500 dark:text-slate-400">#{order._id.slice(-6).toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                            {order.user?.name || "Guest"}
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">{order.user?.email || "No email"}</div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-600 dark:text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-5 text-sm font-black text-gray-900 dark:text-white">
                                        ${order.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusColors[order.status]} border border-current opacity-80`}>
                                            <StatusIcon status={order.status} />
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Link
                                            href={`/admin/orders/${order._id}`}
                                            className="inline-flex items-center px-4 py-2 text-sm font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                                        >
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-50 dark:bg-gray-900 mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">No orders found</h3>
                        <p className="mt-2 text-gray-500 max-w-xs mx-auto">Transactions will appear here once customers start placing orders.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
