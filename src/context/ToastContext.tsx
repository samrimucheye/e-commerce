"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import Image from "next/image";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    image?: string;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, image?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "success", image?: string) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type, image }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    // Helper to check if image URL is valid
    const isValidImageUrl = (url?: string): boolean => {
        if (!url) return false;
        try {
            return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
        } catch {
            return false;
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            flex items-center gap-3 min-w-[300px] max-w-sm p-4 rounded-xl shadow-2xl border
                            transition-all duration-500 animate-in slide-in-from-right-full fade-in
                            ${toast.type === 'success' ? 'bg-white dark:bg-gray-800 border-green-500/20 text-gray-900 dark:text-white' : ''}
                            ${toast.type === 'error' ? 'bg-white dark:bg-gray-800 border-rose-500/20 text-gray-900 dark:text-white' : ''}
                            ${toast.type === 'info' ? 'bg-white dark:bg-gray-800 border-blue-500/20 text-gray-900 dark:text-white' : ''}
                        `}
                    >
                        {/* Icon or Image */}
                        {isValidImageUrl(toast.image) ? (
                            <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                                <Image
                                    src={toast.image!}
                                    alt="Product"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                                toast.type === 'error' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30' :
                                    'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                                }`}>
                                {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                                {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                                {toast.type === 'info' && <Info className="w-5 h-5" />}
                            </div>
                        )}

                        <div className="flex-1">
                            <p className="text-sm font-bold">{toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}</p>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{toast.message}</p>
                        </div>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
