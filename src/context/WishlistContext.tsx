"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface Product {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    stock: number;
}

interface WishlistContextType {
    wishlist: Product[];
    toggleWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session } = useSession();
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
        if (!session) return;
        setLoading(true);
        try {
            const res = await fetch("/api/wishlist");
            if (res.ok) {
                const data = await res.json();
                setWishlist(data); // Store full product objects
            }
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const toggleWishlist = async (productId: string) => {
        if (!session) {
            window.location.href = "/login";
            return;
        }

        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            if (res.ok) {
                await fetchWishlist(); // Refresh wishlist after toggle
            }
        } catch (error) {
            console.error("Failed to toggle wishlist", error);
        }
    };

    const removeFromWishlist = async (productId: string) => {
        await toggleWishlist(productId); // Toggle will remove if already in wishlist
    };

    const isInWishlist = (productId: string) => wishlist.some(p => p._id === productId);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, removeFromWishlist, isInWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
