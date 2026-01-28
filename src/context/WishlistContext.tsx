"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/lib/data";

type WishlistContextType = {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("useWishlist must be used within WishlistProvider");
    return context;
};

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<Product[]>([]);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("wishlist");
        if (stored) {
            try {
                setWishlist(JSON.parse(stored));
            } catch (error) {
                console.error("Error loading wishlist from localStorage:", error);
            }
        }
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product: Product) => {
        setWishlist(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) {
                return prev; // Already in wishlist
            }
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlist(prev => prev.filter(p => p.id !== id));
    };

    const isInWishlist = (id: string) => {
        return wishlist.some(p => p.id === id);
    };

    const clearWishlist = () => {
        setWishlist([]);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}
