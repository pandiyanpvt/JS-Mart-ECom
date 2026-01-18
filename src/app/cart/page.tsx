"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CartModal() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggleModal = () => setIsOpen(!isOpen);

    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    const handleCheckout = () => {
        if (!cart.length) return;
        router.push("/checkout/address");
        setIsOpen(false);
    };

    return (
        <>
            {/* Cart Button */}
            <button
                onClick={toggleModal}
                className="relative p-2 rounded hover:bg-gray-100 transition"
            >
                🛒
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
            {cart.length}
          </span>
                )}
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
                    <div className="bg-white w-full sm:w-96 p-6 h-full overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Your Cart</h2>
                            <button onClick={toggleModal} className="text-gray-500 hover:text-gray-800">
                                ✖
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <p className="text-center text-gray-500 mt-20">Your cart is empty 😢</p>
                        ) : (
                            <>
                                <ul className="space-y-4">
                                    {cart.map((item) => (
                                        <li key={item.id} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={item.quantity || 1}
                                                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                                    className="w-16 border rounded px-2 py-1 mt-1"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p>Rs. {(item.price * (item.quantity || 1)).toFixed(2)}</p>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-600 hover:underline text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 flex justify-between items-center font-bold">
                                    <p>Total: Rs. {total.toFixed(2)}</p>
                                    <div className="flex gap-2">
                                        <Button onClick={clearCart} variant="destructive" size="sm">
                                            Clear
                                        </Button>
                                        <Button onClick={handleCheckout} size="sm">
                                            Checkout
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
