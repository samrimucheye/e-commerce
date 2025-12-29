"use client";

import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

// Custom loader to ensure script loads properly
const ButtonWrapper = ({ showSpinner, shippingAddress }: { showSpinner: boolean, shippingAddress: any }) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();

    const createOrder = async () => {
        try {
            const response = await fetch("/api/orders/paypal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, shippingAddress }),
            });
            const order = await response.json();
            return order.id; // Returns PayPal Order ID
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    };

    const onApprove = async (data: any) => {
        try {
            const response = await fetch("/api/orders/paypal", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: data.orderID }),
            });

            const orderData = await response.json();

            if (response.ok) {
                clearCart();
                router.push(`/checkout/complete?payment_intent=${orderData.id}`); // Reusing payment_intent param for generic order ID
            } else {
                alert("Transaction failed!");
            }
        } catch (error) {
            console.error("Error capturing order:", error);
            alert("Transaction failed! See console for details.");
        }
    };

    return (
        <>
            {(showSpinner && isPending) && <div className="spinner" />}
            <PayPalButtons
                style={{ layout: "vertical" }}
                disabled={false}
                forceReRender={[totalPrice, shippingAddress]}
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </>
    );
}

export default function PayPalCheckout({ shippingAddress }: { shippingAddress: any }) {
    const { totalPrice } = useCart();

    // Fallback for missing client ID
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    if (!clientId) {
        return <div className="text-red-500">Error: PayPal Client ID not found.</div>;
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <PayPalScriptProvider options={{ clientId, components: "buttons", currency: "USD" }}>
                <ButtonWrapper showSpinner={false} shippingAddress={shippingAddress} />
            </PayPalScriptProvider>
        </div>
    );
}
