"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";

export type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    weight?: string;
    tag?: string;
    quantity?: number;
};

const CART_COOKIE_NAME = "jsmart_cart";
const CART_COOKIE_DAYS = 7;

type CartContextType = {
    cart: Product[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Product[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        let loaded: Product[] = [];
        const fromCookie = Cookies.get(CART_COOKIE_NAME);
        if (fromCookie) {
            try {
                loaded = JSON.parse(fromCookie);
            } catch (e) {
                console.error("Failed to parse cart cookie", e);
            }
        }
        if (loaded.length === 0 && typeof localStorage !== "undefined") {
            const fromStorage = localStorage.getItem("cartItems");
            if (fromStorage) {
                try {
                    loaded = JSON.parse(fromStorage);
                    localStorage.removeItem("cartItems");
                } catch (e) {
                    console.error("Failed to migrate cart from localStorage", e);
                }
            }
        }
        if (loaded.length > 0) setCart(loaded);
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            const value = JSON.stringify(cart);
            Cookies.set(CART_COOKIE_NAME, value, {
                path: "/",
                sameSite: "Lax",
                expires: CART_COOKIE_DAYS,
            });
        }
    }, [cart, isInitialized]);

    const addToCart = (product: Product, quantity = 1) => {
        setCart(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) {
                return prev.map(p =>
                    p.id === product.id ? { ...p, quantity: (p.quantity || 1) + quantity } : p
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (id: string) => setCart(prev => prev.filter(p => p.id !== id));
    const updateQuantity = (id: string, quantity: number) =>
        setCart(prev => prev.map(p => (p.id === id ? { ...p, quantity } : p)));
    const clearCart = () => setCart([]);
    const total = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
}
