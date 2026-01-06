"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function HomeNewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setStatus("success");
            setMessage(data.message);
            setEmail("");
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message);
        }
    };

    if (status === "success") {
        return (
            <div className="mt-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] animate-in fade-in zoom-in-95 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                    <CheckCircle className="h-10 w-10 text-indigo-400" />
                    <p className="text-white font-bold text-lg">{message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="mt-12 flex flex-col sm:flex-row max-w-md gap-4 mx-auto">
                <div className="flex-auto space-y-2">
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === "loading"}
                        className="w-full rounded-3xl border-0 bg-white/5 px-6 py-4 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 placeholder:text-slate-500 transition-all disabled:opacity-50"
                        placeholder="name@email.com"
                    />
                </div>
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex-none rounded-3xl bg-indigo-600 px-8 py-4 text-sm font-black text-white shadow-xl hover:bg-indigo-500 transition-all active:scale-95 disabled:bg-indigo-800 flex items-center justify-center gap-2"
                >
                    {status === "loading" ? (
                        <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Joining...</span>
                        </>
                    ) : (
                        "Join Circle"
                    )}
                </button>
            </form>
            {status === "error" && (
                <p className="mt-4 text-rose-400 text-sm flex items-center justify-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-4 w-4" /> {message}
                </p>
            )}
        </div>
    );
}
