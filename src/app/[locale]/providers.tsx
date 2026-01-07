"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/context/ToastContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <CartProvider>
                    <WishlistProvider>
                        <ToastProvider>
                            {children}
                        </ToastProvider>
                    </WishlistProvider>
                </CartProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
