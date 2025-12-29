"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        slug: string;
        price: number;
        images: string[];
        category: {
            name: string;
        }
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if clicked on button
        addItem({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0] || "https://placehold.co/600x400",
            quantity: 1,
        });
    };

    return (
        <div key={product._id} className="group relative border dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <Link href={`/products/${product.slug}`}>
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200 lg:aspect-none group-hover:opacity-75 h-64 relative">
                    <Image
                        src={product.images[0] || "https://placehold.co/600x400"}
                        alt={product.name}
                        fill
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                </div>
                <div className="mt-4 flex justify-between px-4 pb-4">
                    <div>
                        <h3 className="text-sm text-gray-700 dark:text-gray-200">
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{product.category?.name || 'Category'}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">${product.price.toFixed(2)}</p>
                </div>
            </Link>
            <div className="px-4 pb-4">
                <button
                    onClick={handleAddToCart}
                    className="relative w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-10"
                >
                    <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                </button>
            </div>
        </div>
    );
}
