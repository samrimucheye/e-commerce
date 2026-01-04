"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { ShoppingBag, AlertCircle } from "lucide-react";

interface Variant {
    type: string;
    value: string;
    priceAdjustment: number;
    stock: number;
    image?: string;
}

interface Product {
    _id: string;
    name: string;
    price: number;
    slug: string;
    images: string[];
    variants: Variant[];
}

export default function AddToCart({ product }: { product: Product }) {
    const { addItem } = useCart();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [showError, setShowError] = useState(false);

    // Group variants by type (e.g. Color: [Red, Blue])
    // Note: This logic assumes simple variants. For complex combinations, we might need a different structure.
    // For now, let's treat the flat list as selectable options.
    // If the user has multiple types (e.g. Color AND Size), this flat list approach might be tricky if not structured.
    // Based on previous JSON, variants are a flat list: [{type: "Color", value: "Black"}, {type: "Color", value: "White"}]

    // We will just let user select one "Option" from the list for now.
    // If there are multiple Types, we might want to group them?
    // Let's stick to the user's JSON structure: simple list.

    const currentPrice = selectedVariant
        ? product.price + (selectedVariant.priceAdjustment || 0)
        : product.price;

    const handleAddToCart = () => {
        if (product.variants.length > 0 && !selectedVariant) {
            setShowError(true);
            return;
        }

        const imageToUse = selectedVariant?.image || product.images[0] || "https://placehold.co/600x400";

        addItem({
            productId: product._id,
            name: product.name + (selectedVariant ? ` (${selectedVariant.value})` : ""),
            price: currentPrice,
            image: imageToUse,
            quantity: 1,
            variant: selectedVariant ? selectedVariant.value : undefined,
            slug: product.slug
        });

        // Trigger Toast with specific image
        showToast(`Added ${product.name} ${selectedVariant ? `(${selectedVariant.value})` : ''} to cart`, "success", imageToUse);

        setTimeout(() => setLoading(false), 500);
    };

    return (
        <div className="space-y-6">
            {/* Price Display */}
            <div className="flex items-baseline space-x-2">
                <p className="text-3xl tracking-tight text-gray-900 dark:text-white">${currentPrice.toFixed(2)}</p>
                {selectedVariant && selectedVariant.priceAdjustment !== 0 && (
                    <span className="text-sm text-gray-500">
                        {selectedVariant.priceAdjustment > 0 ? '+' : ''}{selectedVariant.priceAdjustment} ({selectedVariant.value})
                    </span>
                )}
            </div>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Available Options</h3>
                    <div className="flex flex-wrap gap-3">
                        {product.variants.map((variant, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setSelectedVariant(variant);
                                    setShowError(false);
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${selectedVariant === variant
                                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md transform scale-105"
                                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800"
                                    }`}
                            >
                                {variant.value}
                            </button>
                        ))}
                    </div>
                    {showError && (
                        <p className="text-sm text-rose-500 flex items-center animate-pulse">
                            <AlertCircle className="w-4 h-4 mr-1" /> Please select an option
                        </p>
                    )}
                </div>
            )}

            <button
                onClick={handleAddToCart}
                disabled={loading || (product.variants.length > 0 && !selectedVariant)}
                className="flex w-full items-center justify-center rounded-2xl border border-transparent bg-indigo-600 px-8 py-4 text-base font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
            >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {loading ? "Added!" : "Add to Cart"}
            </button>
        </div>
    );
}
