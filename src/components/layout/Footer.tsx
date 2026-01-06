"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin, Send } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 sm:grid-cols-2">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="text-2xl font-bold text-white tracking-tight">
                            STORE<span className="text-indigo-500">.</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Experience the future of online shopping. We bring you curated collections and premium quality products from around the globe.
                        </p>
                        <div className="flex space-x-5">
                            <a href="#" className="hover:text-indigo-400 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-indigo-400 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Shop</h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link href="/products" className="hover:text-white transition-colors">All Products</Link>
                            </li>
                            <li>
                                <Link href="/products?category=new" className="hover:text-white transition-colors">New Arrivals</Link>
                            </li>
                            <li>
                                <Link href="/products?category=sale" className="hover:text-white transition-colors">Sale</Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
                                    Returns & Exchanges
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping-policy" className="text-gray-400 hover:text-white transition-colors">
                                    Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Newsletter</h3>
                        <p className="text-sm text-gray-400">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-gray-500 font-medium">
                    <p>&copy; 2025 STORE Inc. All rights reserved.</p>
                    <div className="flex items-center space-x-6">
                        <div className="flex space-x-2 grayscale opacity-40 hover:opacity-100 transition-all cursor-default">
                            {/* Simplified represention of payment methods */}
                            <span className="border border-gray-700 rounded px-1.5 py-0.5">VISA</span>
                            <span className="border border-gray-700 rounded px-1.5 py-0.5">MC</span>
                            <span className="border border-gray-700 rounded px-1.5 py-0.5">PP</span>
                            <span className="border border-gray-700 rounded px-1.5 py-0.5">AE</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
