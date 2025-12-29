"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Trash2 } from "lucide-react";

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice } = useCart();

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 bg-white dark:bg-gray-900 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your cart is empty</h2>
                <p className="text-gray-500 dark:text-gray-400">Looks like you haven't added any products yet.</p>
                <Link
                    href="/products"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Shopping Cart</h1>

                <div className="mt-8">
                    <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-gray-200 dark:divide-gray-800">
                            {items.map((item) => (
                                <li key={`${item.productId}-${item.variant}`} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={100}
                                            height={100}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                                <h3>
                                                    <Link href={`/products/${item.productId}`}>{item.name}</Link>
                                                </h3>
                                                <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            {item.variant && (
                                                <p className="mt-1 text-sm text-gray-500">{item.variant}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-1 items-end justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <p className="text-gray-500 dark:text-gray-400">Qty</p>
                                                <select
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value), item.variant)}
                                                    className="rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-1.5 text-base leading-5 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm text-gray-900 dark:text-white"
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(qty => (
                                                        <option key={qty} value={qty}>{qty}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.productId, item.variant)}
                                                className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-8">
                    <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                        <p>Subtotal</p>
                        <p>${totalPrice.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                        <Link
                            href="/checkout"
                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
