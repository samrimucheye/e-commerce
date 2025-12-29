"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Package, User, MapPin, CreditCard, CheckCircle, Clock, Truck } from "lucide-react";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await fetch(`/api/orders/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                } else {
                    setError("Failed to fetch order");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [id]);

    async function updateStatus(status: string) {
        setUpdating(true);
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                const updated = await res.json();
                setOrder(updated);
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setUpdating(false);
        }
    }

    async function markAsDelivered() {
        setUpdating(true);
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isDelivered: true }),
            });
            if (res.ok) {
                const updated = await res.json();
                setOrder(updated);
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setUpdating(false);
        }
    }

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!order) return <div className="p-8 text-center">Order not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back to Orders
            </button>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Order #{order._id.slice(-6)}</h1>
                    <p className="text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex space-x-3">
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <>
                            <select
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={order.status}
                                onChange={(e) => updateStatus(e.target.value)}
                                disabled={updating}
                            >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="shipped">Shipped</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            {order.status === 'shipped' && !order.isDelivered && (
                                <button
                                    onClick={markAsDelivered}
                                    disabled={updating}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                                >
                                    Mark as Delivered
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    {/* Items */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
                            <Package className="h-5 w-5 mr-2 text-gray-400" />
                            <h2 className="font-semibold text-gray-700">Order Items</h2>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {order.items.map((item: any) => (
                                <li key={item._id} className="p-6 flex items-center">
                                    <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-md flex-shrink-0" />
                                    <div className="ml-4 flex-1">
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-gray-500 text-sm">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">${(item.quantity * item.price).toFixed(2)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                                <span>Total Amount</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Customer Info */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <User className="h-5 w-5 mr-2 text-gray-400" />
                            <h2 className="font-semibold text-gray-700">Customer Info</h2>
                        </div>
                        <p className="font-medium text-gray-900">{order.user?.name || "Guest"}</p>
                        <p className="text-gray-500 text-sm">{order.user?.email || order.shippingAddress.email}</p>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                            <h2 className="font-semibold text-gray-700">Shipping Address</h2>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                            <h2 className="font-semibold text-gray-700">Payment Status</h2>
                        </div>
                        <div className="flex items-center">
                            {order.isPaid ? (
                                <>
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                    <span className="text-green-700 font-medium">Paid on {new Date(order.paidAt).toLocaleDateString()}</span>
                                </>
                            ) : (
                                <>
                                    <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                                    <span className="text-yellow-700 font-medium">Payment Pending</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
