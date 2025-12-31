"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Heart, Calendar, DollarSign, TrendingUp, Package } from "lucide-react";
import Link from "next/link";

interface ProfileStats {
    totalOrders: number;
    totalSpent: number;
    wishlistCount: number;
    accountAge: number;
}

interface RecentOrder {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

export default function ProfileOverview() {
    const [stats, setStats] = useState<ProfileStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/profile/stats');

            if (!res.ok) {
                console.error('Failed to fetch stats:', res.status);
                // Set default values for new users
                setStats({
                    totalOrders: 0,
                    totalSpent: 0,
                    wishlistCount: 0,
                    accountAge: 0,
                });
                setRecentOrders([]);
                return;
            }

            const data = await res.json();
            setStats(data.stats || {
                totalOrders: 0,
                totalSpent: 0,
                wishlistCount: 0,
                accountAge: 0,
            });
            setRecentOrders(data.recentOrders || []);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            // Set default values on error
            setStats({
                totalOrders: 0,
                totalSpent: 0,
                wishlistCount: 0,
                accountAge: 0,
            });
            setRecentOrders([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-32" />
                ))}
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        paid: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Total Orders */}
                <div className="group bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <TrendingUp className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Total Orders</h3>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats?.totalOrders || 0}</p>
                </div>

                {/* Total Spent */}
                <div className="group bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-800 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl group-hover:scale-110 transition-transform">
                            <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Total Spent</h3>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">${stats?.totalSpent.toFixed(2) || '0.00'}</p>
                </div>

                {/* Wishlist Items */}
                <div className="group bg-gradient-to-br from-rose-50 to-white dark:from-rose-900/20 dark:to-gray-800 p-6 rounded-2xl border border-rose-100 dark:border-rose-800 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-rose-100 dark:bg-rose-900/40 rounded-xl group-hover:scale-110 transition-transform">
                            <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Wishlist Items</h3>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats?.wishlistCount || 0}</p>
                </div>

                {/* Account Age */}
                <div className="group bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-800 p-6 rounded-2xl border border-amber-100 dark:border-amber-800 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-xl group-hover:scale-110 transition-transform">
                            <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Member Since</h3>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats?.accountAge || 0}<span className="text-lg font-medium ml-1">days</span></p>
                </div>
            </div>

            {/* Recent Orders */}
            {recentOrders.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                            <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            Recent Orders
                        </h2>
                        <Link
                            href="/profile?tab=orders"
                            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <div
                                key={order._id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors gap-3"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                                        <ShoppingBag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">#{order.orderNumber}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || statusColors.pending}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                    <p className="font-black text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                    href="/wishlist"
                    className="group p-6 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl text-white hover:shadow-2xl hover:shadow-rose-500/30 transition-all"
                >
                    <Heart className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-black mb-1">View Wishlist</h3>
                    <p className="text-sm text-rose-100">Manage your saved items</p>
                </Link>

                <Link
                    href="/products"
                    className="group p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white hover:shadow-2xl hover:shadow-indigo-500/30 transition-all"
                >
                    <ShoppingBag className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-black mb-1">Continue Shopping</h3>
                    <p className="text-sm text-indigo-100">Explore our products</p>
                </Link>
            </div>
        </div>
    );
}
