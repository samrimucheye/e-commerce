"use client";

import { useState } from "react";
import { Mail, Send, MessageSquare, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/animations/AnimatedSection";

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
        <div className="bg-white dark:bg-gray-950 min-h-screen relative overflow-hidden transition-colors duration-500">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] -z-10" />

            <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Left: Contact Info */}
                    <AnimatedSection direction="right" className="space-y-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm tracking-wide uppercase">
                                <Sparkles className="h-4 w-4" />
                                <span>Get in touch</span>
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white sm:text-7xl leading-[1.1]">
                                Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Conversation.</span>
                            </h1>
                            <p className="max-w-xl text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                Whether you have a specific question or just want to explore possibilities, our premium support team is ready to assist you.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="group flex items-center space-x-6 p-6 rounded-3xl bg-white dark:bg-gray-900 shadow-xl shadow-indigo-500/5 border border-indigo-50 dark:border-gray-800 transition-all hover:scale-[1.02] hover:shadow-indigo-500/10">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 group-hover:rotate-6 transition-transform">
                                    <Mail className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Email us</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">support@store.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 pt-10 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-950 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Support representative" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                <span className="text-gray-900 dark:text-white font-bold">4+ Specialists</span> online right now
                            </p>
                        </div>
                    </AnimatedSection>

                    {/* Right: Contact Form with Glassmorphism */}
                    <AnimatedSection direction="left" delay={0.2}>
                        <div className="relative group">
                            {/* Decorative Blur behind form */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl p-10 sm:p-12 rounded-[2.5rem] border border-white/20 dark:border-gray-800/50 shadow-2xl">
                                {status === "success" ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                                        <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center text-white animate-bounce-subtle">
                                            <Send className="h-10 w-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-black text-gray-900 dark:text-white italic">Message Delivered!</h3>
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">We've received your request and will reach out shortly.</p>
                                        </div>
                                        <button
                                            onClick={() => setStatus("idle")}
                                            className="px-8 py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
                                        >
                                            Send Another
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 ml-1">First Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="John"
                                                    className="block w-full rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 px-5 py-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-700/50 focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 ml-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Doe"
                                                    className="block w-full rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 px-5 py-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-700/50 focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 ml-1">Work Email</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="john@example.com"
                                                className="block w-full rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 px-5 py-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-700/50 focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 ml-1">Message Details</label>
                                            <textarea
                                                rows={4}
                                                required
                                                placeholder="What's on your mind?"
                                                className="block w-full rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 px-5 py-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-700/50 focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={status === "loading"}
                                            className="w-full relative group bg-indigo-600 rounded-2xl px-6 py-5 text-lg font-black text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {status === "loading" ? (
                                                <div className="flex items-center justify-center space-x-3">
                                                    <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Processing...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <MessageSquare className="h-5 w-5" />
                                                    <span>Initiate Conversation</span>
                                                </div>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
}
