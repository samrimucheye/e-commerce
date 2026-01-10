"use client";

import PayPalCheckout from "@/components/checkout/PayPalCheckout";
import ShippingForm from "@/components/checkout/ShippingForm";
import { useCart } from "@/context/CartContext";
import { useRouter } from "@/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
    const { items, totalPrice } = useCart();
    const { data: session, status } = useSession();
    const [shippingDetails, setShippingDetails] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/checkout");
        }
    }, [status, router]);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/profile'); // Assuming we have or will create this
                if (res.ok) {
                    const data = await res.json();
                    setUserProfile(data);
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    if (loading || status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render checkout if not authenticated (will redirect)
    if (status === "unauthenticated") {
        return null;
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-20 min-h-[50vh] flex flex-col justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your cart is empty.</h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Add some products before checking out.</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-10 text-center">Complete Your Purchase</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Shipping Form */}
                    <div className="md:col-span-2 space-y-8">
                        {!shippingDetails ? (
                            <ShippingForm
                                onSubmit={setShippingDetails}
                                initialData={userProfile}
                            />
                        ) : (
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-green-100 dark:border-green-900/30 relative">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Shipping Details Confirmed</h2>
                                    <button
                                        onClick={() => setShippingDetails(null)}
                                        className="text-indigo-600 text-sm font-medium hover:underline"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    <p className="font-semibold text-gray-900 dark:text-white">{shippingDetails.fullName}</p>
                                    <p>{shippingDetails.address}</p>
                                    <p>{shippingDetails.city}, {shippingDetails.postalCode}</p>
                                    <p>{shippingDetails.country}</p>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 text-center">Payment</h2>
                                    <PayPalCheckout shippingAddress={shippingDetails} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={`${item.productId}-${item.variant}`} className="flex justify-between text-sm">
                                        <div className="text-gray-600 dark:text-gray-400">
                                            {item.name} <span className="text-gray-400 dark:text-gray-500">x{item.quantity}</span>
                                        </div>
                                        <div className="font-medium text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
