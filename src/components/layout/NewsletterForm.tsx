"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NewsletterForm() {
    const t = useTranslations("Newsletter");
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

            // Reset after 5 seconds
            setTimeout(() => setStatus("idle"), 5000);
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message);
        }
    };

    return (
        <div className="relative mt-4 space-y-2">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("placeholder")}
                    required
                    disabled={status === "loading"}
                    className="w-full bg-gray-800 border-none rounded-lg py-3 pl-4 pr-12 text-sm text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="absolute right-1 top-1 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-md transition-colors disabled:bg-gray-700"
                >
                    {status === "loading" ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </button>
            </form>

            {status === "success" && (
                <p className="text-green-400 text-xs flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <CheckCircle className="h-3 w-3" /> {message}
                </p>
            )}
            {status === "error" && (
                <p className="text-rose-400 text-xs flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-3 w-3" /> {message}
                </p>
            )}
        </div>
    );
}
