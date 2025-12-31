"use client";

import { useWishlist } from "@/context/WishlistContext";
import { Heart, ShoppingCart, Trash2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProfileWishlist() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addItem } = useCart();

    const handleAddToCart = (product: any) => {
        addItem({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            quantity: 1,
        });
    };

    if (wishlist.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your Wishlist is Empty</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Save items you love for later!</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {wishlist.map((product) => (
                <div
                    key={product._id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all"
                >
                    <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img
                            src={product.images?.[0] || 'https://placehold.co/400x400'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                removeFromWishlist(product._id);
                            }}
                            className="absolute top-3 right-3 p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </Link>

                    <div className="p-4">
                        <Link
                            href={`/products/${product.slug}`}
                            className="font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2 mb-2 block"
                        >
                            {product.name}
                        </Link>

                        <div className="flex items-center justify-between mb-4">
                            <p className="text-2xl font-black text-gray-900 dark:text-white">
                                ${product.price?.toFixed(2) || '0.00'}
                            </p>
                            {(product.stock ?? 0) > 0 ? (
                                <span className="text-xs font-bold text-green-600 dark:text-green-400">In Stock</span>
                            ) : (
                                <span className="text-xs font-bold text-red-600 dark:text-red-400">Out of Stock</span>
                            )}
                        </div>

                        <button
                            onClick={() => handleAddToCart(product)}
                            disabled={(product.stock ?? 0) === 0}
                            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
