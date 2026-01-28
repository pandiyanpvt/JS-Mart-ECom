"use client";

import {useCart} from "@/context/CartContext";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

type CartModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function CartModal({isOpen, onClose}: CartModalProps) {
    const {cart, removeFromCart, updateQuantity, clearCart} = useCart();
    const router = useRouter();

    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    const handleCheckout = () => {
        if (!cart.length) return;

        // Save cart to localStorage for Cart page
        localStorage.setItem("cartItems", JSON.stringify(cart));

        onClose();
        router.push("/cart");
    };

    if (!isOpen) return null; // Don't render anything if not open

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
            <div className="bg-white w-full sm:w-96 p-6 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Your Cart</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
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
                                    <div className="flex gap-3">

                                        <img
                                            src={
                                                item.image?.startsWith("http")
                                                    ? item.image
                                                    : item.image
                                                        ? `/${item.image}`
                                                        : "/placeholder.png"
                                            }
                                            className="h-14 w-14 rounded object-cover"
                                            alt={item.name}
                                        />
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
    );
}
