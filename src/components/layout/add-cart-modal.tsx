"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type CartModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function CartModal({ isOpen, onClose }: CartModalProps) {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const router = useRouter();

    const total = cart.reduce(
        (sum, item) => sum + (item.price * (item.quantity || 1)),
        0
    );

    const handleCheckout = () => {
        if (!cart.length) return;

        localStorage.setItem("cartItems", JSON.stringify(cart));
        onClose();
        router.push("/cart");
    };

    const handleStartShopping = () => {
        onClose();
        router.push("/shop");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
            {/* Modal Container */}
            <div className="bg-white w-full sm:w-96 h-full flex flex-col shadow-xl rounded-l-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold">Your Cart</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-lg font-bold"
                    >
                        ✖
                    </button>
                </div>

                {/* Cart Items */}
                {cart.length === 0 ? (
                    <div className="flex flex-col flex-1 justify-end"> {/* full height flex */}
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-gray-500 text-lg">Your cart is empty 😢</p>
                        </div>
                        <div className="p-6 border-t">
                            <Button
                                onClick={handleStartShopping}
                                className="w-full bg-[#005000] hover:bg-[#006600] text-white py-2 rounded-md"
                            >
                                Start Shopping
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center border-b pb-3"
                                >
                                    <div className="flex gap-3">
                                        <img
                                            src={
                                                item.image?.startsWith("http")
                                                    ? item.image
                                                    : item.image
                                                        ? `/${item.image}`
                                                        : "/placeholder.png"
                                            }
                                            className="h-16 w-16 rounded object-cover"
                                            alt={item.name}
                                        />
                                        <div>
                                            <p className="font-semibold text-sm">{item.name}</p>
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.quantity || 1}
                                                onChange={(e) =>
                                                    updateQuantity(item.id, Number(e.target.value))
                                                }
                                                className="w-16 border rounded px-2 py-1 mt-1 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <p className="font-medium">
                                            AUD {(item.price * (item.quantity || 1)).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Buttons */}
                        <div className="p-6 border-t flex flex-col gap-3">
                            <p className="text-right font-bold text-lg">
                                Total: AUD {total.toFixed(2)}
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    onClick={clearCart}
                                    variant="destructive"
                                    className="flex-1"
                                >
                                    Clear Cart
                                </Button>
                                <Button onClick={handleCheckout} className="flex-1 bg-[#005000] hover:bg-[#006600] text-white">
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
