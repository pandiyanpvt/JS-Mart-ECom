"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Heading} from "@/components/ui/heading";
import {useRouter} from "next/navigation";

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
                i.id === id ? {...i, quantity: qty} : i
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
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-2">

                {/* HEADER */}
                <div className="flex justify-between">
                    <div>
                        <Heading className="tracking-tight">Shopping Cart</Heading>
                        <p className="text-base text-gray-500">
                            Items in your shopping cart
                        </p>
                    </div>


                </div>

                {/* EMPTY */}
                {cartItems.length === 0 ? (
                    <div className="mt-20 text-center text-gray-500 font-medium">
                        Your cart is empty —{" "}
                        <Link
                            href="/shop"
                            className="underline text-emerald-600"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white mt-6">

                        <div
                            className="mt-4 grid grid-cols-4 text-sm font-medium text-gray-500 gap-4 ">
                            <div>Product</div>
                            <div className="text-center">Price</div>
                            <div className="text-center">Quantity</div>
                            <div className="text-end">SubT total</div>
                        </div>

                        <ul className="mt-2 divide-y border-t border-b">

                            {cartItems.map(item => (
                                <li
                                    key={item.id}
                                    className="grid grid-cols-[auto_1.3fr_1fr_1fr_1fr] gap-4 py-4 items-center px-2"
                                >
                                    {/* IMAGE */}
                                    <img
                                        src={
                                            item.image?.startsWith("http")
                                                ? item.image
                                                : item.image
                                                    ? `/${item.image}`
                                                    : "/placeholder.png"
                                        }
                                        alt={item.name}
                                        className="h-20 w-20 rounded object-cover"
                                    />

                                    {/* NAME */}
                                    <p className="font-medium text-gray-700">
                                        {item.name}
                                    </p>
                                    {/* PRICE */}
                                    <p className="mt-2  font-medium">
                                        {item.price}
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
                                            className="w-16 border rounded text-center"
                                        />
                                            <button
                                                onClick={() =>
                                                    handleRemoveItem(item.id)
                                                }
                                                className="mt-1 text-sm underline text-red-500"
                                            >
                                                Remove
                                            </button>

                                    </div>
                                    {/* SUBTOTAL */}
                                    <p className="mt-2 font-medium text-end">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>

                                </li>
                                ))}

                        </ul>

                        {/* SUMMARY */}
                        <div className="mt-6 flex justify-between items-center gap-6">
                            <span className="mt-6">
                               {cartItems.length > 0 && (
                                   <Button onClick={handleReturn} className="text-sm ">
                                       Return To Shop
                                   </Button>
                               )}
                            </span>

                            <div className="flex flex-col items-end">
                                <p className="text-lg font-bold">
                                    Total: ${total.toFixed(2)}
                                </p>
                                <Button onClick={handleCheckout} className="bg-emerald-600">
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
