"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Mail, Lock, Loader2, ArrowRight, User, LogIn, Sparkles } from "lucide-react";

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                const loginRedirect = `/login?registered=true${callbackUrl !== "/" ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`;
                router.push(loginRedirect);
            } else {
                const data = await res.json();
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full space-y-8 backdrop-blur-xl bg-white/10 dark:bg-slate-900/40 p-10 rounded-3xl border border-white/20 shadow-2xl animate-fade-in-up">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 mb-6 shadow-lg shadow-indigo-500/20">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                    Create Account
                </h2>
                <p className="mt-2 text-indigo-200/60 font-medium">
                    Start your shopping journey with us
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="relative group text-white">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="block w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-white/20 text-white"
                            placeholder="Full Name"
                        />
                    </div>
                    <div className="relative group text-white">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            className="block w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-white/20 text-white"
                            placeholder="Email address"
                        />
                    </div>
                    <div className="relative group text-white">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="block w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-white/20 text-white"
                            placeholder="Password"
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-rose-400 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="relative group w-full flex items-center justify-center py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Sign Up
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <div className="pt-4 text-center">
                    <Link
                        href={`/login${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
                        className="inline-flex items-center text-sm font-semibold text-indigo-300 hover:text-white transition-colors"
                    >
                        <LogIn className="w-4 h-4 mr-2" />
                        Already have an account? Sign In
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
