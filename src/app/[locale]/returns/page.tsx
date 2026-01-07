"use client";

import { useState, useEffect } from "react";
import { Package, RotateCcw, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Order {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    items: Array<{
        product: {
            _id: string;
            name: string;
            image: string;
        };
        quantity: number;
        price: number;
    }>;
    createdAt: string;
}

export default function ReturnsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [returnType, setReturnType] = useState<"return" | "exchange">("return");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/profile/orders?limit=20');
            const data = await res.json();
            // Only show delivered orders
            setOrders(data.orders?.filter((o: Order) => o.status === 'delivered') || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleItemToggle = (productId: string) => {
        setSelectedItems(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedItems.length === 0) {
            setMessage({ type: "error", text: "Please select at least one item" });
            return;
        }

        setSubmitting(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch('/api/returns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: selectedOrder?._id,
                    items: selectedItems,
                    reason,
                    description,
                    type: returnType,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: "Return request submitted successfully!" });
                setSelectedOrder(null);
                setSelectedItems([]);
                setReason("");
                setDescription("");
            } else {
                setMessage({ type: "error", text: data.message || "Failed to submit return request" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Something went wrong. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    const reasons = [
        "Defective or damaged product",
        "Wrong item received",
        "Item not as described",
        "Changed my mind",
        "Better price available",
        "Other",
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/profile" className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 mb-4">
                        ← Back to Profile
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">
                        Returns & Exchanges
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Request a return or exchange for your delivered orders
                    </p>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === "success"
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800"
                            : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800"
                        }`}>
                        {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                {!selectedOrder ? (
                    /* Order Selection */
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-indigo-500" />
                            Select an Order
                        </h2>

                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400 mb-4">No delivered orders available for returns</p>
                                <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                                    Continue Shopping <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <button
                                        key={order._id}
                                        onClick={() => setSelectedOrder(order)}
                                        className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-left border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-gray-900 dark:text-white">Order #{order.orderNumber}</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {order.items.length} item(s)
                                            </span>
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                ${order.totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Return Form */
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Return Type */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Request Type</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setReturnType("return")}
                                    className={`p-4 rounded-xl border-2 transition-all ${returnType === "return"
                                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                            : "border-gray-200 dark:border-gray-700"
                                        }`}
                                >
                                    <RotateCcw className="w-6 h-6 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
                                    <p className="font-bold text-gray-900 dark:text-white">Return</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Get a refund</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setReturnType("exchange")}
                                    className={`p-4 rounded-xl border-2 transition-all ${returnType === "exchange"
                                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                            : "border-gray-200 dark:border-gray-700"
                                        }`}
                                >
                                    <Package className="w-6 h-6 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
                                    <p className="font-bold text-gray-900 dark:text-white">Exchange</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Replace item</p>
                                </button>
                            </div>
                        </div>

                        {/* Select Items */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Select Items</h2>
                            <div className="space-y-3">
                                {selectedOrder.items.map((item, idx) => (
                                    <label
                                        key={idx}
                                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.product._id)}
                                            onChange={() => handleItemToggle(item.product._id)}
                                            className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <img
                                            src={item.product.image || 'https://placehold.co/64x64'}
                                            alt={item.product.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 dark:text-white">{item.product.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reason</h2>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="">Select a reason</option>
                                {reasons.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Please provide additional details..."
                                rows={4}
                                className="w-full mt-4 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedOrder(null);
                                    setSelectedItems([]);
                                    setReason("");
                                    setDescription("");
                                }}
                                className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || selectedItems.length === 0}
                                className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? "Submitting..." : "Submit Request"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
