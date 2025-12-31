"use client";

import { useEffect, useState } from "react";
import { Package, ChevronRight, Calendar, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";

interface OrderItem {
    product: {
        _id: string;
        name: string;
        image: string;
        slug: string;
    };
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    items: OrderItem[];
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    createdAt: string;
    updatedAt: string;
}

export default function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/profile/orders?page=${page}&limit=5`);
            const data = await res.json();
            setOrders(data.orders || []);
            setTotalPages(data.pagination?.totalPages || 1);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        paid: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-48" />
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Orders Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Start shopping to see your orders here!</p>
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                    Browse Products <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <div
                    key={order._id}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                >
                    {/* Order Header */}
                    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
                                    <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 dark:text-white">Order #{order.orderNumber}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-4 py-2 rounded-full text-xs font-bold ${statusColors[order.status] || statusColors.pending}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-4 sm:p-6">
                        <div className="space-y-3 mb-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                        <img
                                            src={item.product?.image || 'https://placehold.co/64x64'}
                                            alt={item.product?.name || 'Product'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/products/${item.product?.slug}`}
                                            className="font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
                                        >
                                            {item.product?.name || 'Unknown Product'}
                                        </Link>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        ${(item.quantity * item.price).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Shipping Address */}
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="text-gray-600 dark:text-gray-400">
                                    <p className="font-semibold text-gray-900 dark:text-white">{order.shippingAddress.fullName}</p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-xl font-bold text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-xl font-bold text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
