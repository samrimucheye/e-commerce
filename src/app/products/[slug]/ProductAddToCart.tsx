"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

export default function ProductAddToCart({ product }: { product: any }) {
    const { addItem } = useCart();
    const [loading, setLoading] = useState(false);

    const handleAddToCart = () => {
        setLoading(true);
        addItem({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0] || "https://placehold.co/600x400",
            quantity: 1,
        });
        // Simulate loading/feedback
        setTimeout(() => setLoading(false), 500);
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <ShoppingBag className="mr-2 h-5 w-5" />
            {loading ? "Added!" : "Add to Cart"}
        </button>
    );
}
