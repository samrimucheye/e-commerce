"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        // Simulate API call
        setTimeout(() => {
            setStatus("success");
        }, 1500);
    };

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left: Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Contact Us</h1>
                            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                                Have a question or feedback? We'd love to hear from you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                                    <Mail className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Email</p>
                                    <p className="text-lg font-bold">support@store.com</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                                    <Phone className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">Phone</p>
                                    <p className="text-lg font-bold"> +1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                                    <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">Address</p>
                                    <p className="text-lg font-bold">123 Commerce St, New York, NY 10001</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 italic text-gray-400">
                            Our team typically responds within 24 business hours.
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
                        {status === "success" ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <Send className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                                <p className="text-gray-500">Thank you for reaching out. We'll get back to you shortly.</p>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="text-indigo-600 font-medium hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="mt-1 block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-3"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="last" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="mt-1 block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-3"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="mt-1 block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-3"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Message</label>
                                    <textarea
                                        rows={4}
                                        required
                                        className="mt-1 block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-3"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="w-full flex items-center justify-center space-x-2 bg-indigo-600 px-6 py-4 rounded-xl text-white font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {status === "loading" ? (
                                        <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <MessageSquare className="h-5 w-5" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
