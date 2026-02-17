"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "next/navigation";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export default function ShoppingCart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const router = useRouter()

    useEffect(() => {
        const stored = localStorage.getItem("cartItems");
        if (stored) {
            try {
                setCartItems(JSON.parse(stored));
            } catch {
                localStorage.removeItem("cartItems");
            }
        }
    }, []);

    const saveCart = (items: CartItem[]) => {
        setCartItems(items);
        localStorage.setItem("cartItems", JSON.stringify(items));
    };


    const handleRemoveItem = (id: string) => {
        saveCart(cartItems.filter(i => i.id !== id));
    };

    const handleQuantityChange = (id: string, qty: number) => {
        if (qty < 1) return;

        saveCart(
            cartItems.map(i =>
                i.id === id ? { ...i, quantity: qty } : i
            )
        );
    };

    const total = cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );

    const handleCheckout = () => {
        if (!cartItems.length) return;
        router.push("/checkout");
    };
    const handleReturn = () => {
        if (!cartItems.length) return;
        router.push("/shop");
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8">


            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* EMPTY */}
                {cartItems.length === 0 ? (
                    <div className="mt-20 text-center text-gray-500 font-medium">
                        Your cart is empty —{" "}
                        <Link
                            href="/shop"
                            className="underline text-[#005000]"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white mt-6 rounded-lg shadow-sm overflow-hidden">
                        {/* Desktop Header - Hidden on mobile */}
                        <div className="hidden md:grid mt-4 grid-cols-[100px_2fr_1fr_1fr_1fr] text-sm font-medium text-gray-500 gap-4 border-b pb-4 px-4">
                            <div className="col-span-2">Product</div>
                            <div className="text-center">Price</div>
                            <div className="text-center">Quantity</div>
                            <div className="text-end">Total</div>
                        </div>

                        <ul className="divide-y">
                            {cartItems.map(item => (
                                <li
                                    key={item.id}
                                    className="grid grid-cols-1 md:grid-cols-[100px_2fr_1fr_1fr_1fr] gap-4 py-4 px-4 md:px-0 items-center"
                                >
                                    {/* Mobile Layout */}
                                    <div className="md:hidden flex gap-4 pb-4 border-b border-gray-100">
                                        <div className="h-20 w-20 relative flex-shrink-0">
                                            <img
                                                src={
                                                    item.image?.startsWith("http")
                                                        ? item.image
                                                        : item.image
                                                            ? `/${item.image}`
                                                            : "/placeholder.png"
                                                }
                                                alt={item.name}
                                                className="h-full w-full rounded object-cover border border-gray-100"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-700 mb-2 truncate">
                                                {item.name}
                                            </p>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-600">Price:</span>
                                                <span className="font-medium text-gray-700">${item.price}</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-600">Total:</span>
                                                <span className="font-bold text-[#005000]">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-3">
                                                <label className="text-sm text-gray-600">Qty:</label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={item.quantity}
                                                    onChange={e =>
                                                        handleQuantityChange(
                                                            item.id,
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    className="w-20 border rounded text-center h-9 focus:ring-1 focus:ring-[#005000] outline-none"
                                                />
                                                <button
                                                    onClick={() =>
                                                        handleRemoveItem(item.id)
                                                    }
                                                    className="ml-auto text-xs text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Layout */}
                                    <div className="hidden md:contents">
                                        {/* IMAGE */}
                                        <div className="h-20 w-20 relative">
                                            <img
                                                src={
                                                    item.image?.startsWith("http")
                                                        ? item.image
                                                        : item.image
                                                            ? `/${item.image}`
                                                            : "/placeholder.png"
                                                }
                                                alt={item.name}
                                                className="h-full w-full rounded object-cover border border-gray-100"
                                            />
                                        </div>

                                        {/* NAME */}
                                        <p className="font-medium text-gray-700">
                                            {item.name}
                                        </p>

                                        {/* PRICE */}
                                        <p className="font-medium text-center text-gray-600">
                                            ${item.price}
                                        </p>

                                        {/* QUANTITY */}
                                        <div className="flex flex-col items-center">
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={e =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="w-16 border rounded text-center h-9 focus:ring-1 focus:ring-[#005000] outline-none"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleRemoveItem(item.id)
                                                }
                                                className="mt-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        {/* SUBTOTAL */}
                                        <p className="font-bold text-end text-[#005000]">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* SUMMARY */}
                        <div className="mt-6 px-4 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t pt-6">
                            <div>
                                {cartItems.length > 0 && (
                                    <Button onClick={handleReturn} className="text-sm w-full sm:w-auto">
                                        Return To Shop
                                    </Button>
                                )}
                            </div>

                            <div className="flex flex-col items-end w-full sm:w-auto">
                                <p className="text-lg font-bold mb-3 sm:mb-2">
                                    Total: ${total.toFixed(2)}
                                </p>
                                <Button onClick={handleCheckout} className="bg-[#00028C] hover:bg-[#00026e] w-full sm:w-auto">
                                    Checkout
                                </Button>
                            </div>
                        </div>


                    </div>
                )}

            </div>
        </div>
    );
}
