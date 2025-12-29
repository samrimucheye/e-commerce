"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function CheckoutCompletePage() {
    const searchParams = useSearchParams();
    const paymentIntent = searchParams.get("payment_intent");

    return (
        <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center p-4">
            <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank you for your order!</h1>
            <p className="text-gray-600 mb-2">We have received your payment.</p>
            {paymentIntent && (
                <p className="text-sm text-gray-400 mb-8">Order Ref: {paymentIntent}</p>
            )}

            <div className="space-x-4">
                <Link
                    href="/"
                    className="rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                    Continue Shopping
                </Link>
                <Link
                    href="/products"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Browse Products
                </Link>
            </div>
        </div>
    );
}
