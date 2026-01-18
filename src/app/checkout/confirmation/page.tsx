"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ConfirmationPage() {
    const router = useRouter();
    const { cart, total } = useCart();

    const [address, setAddress] = useState<{name:string,street:string,city:string,zip:string,phone:string} | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("checkoutAddress");
        if (saved) setAddress(JSON.parse(saved));
        else router.replace("/checkout/address"); // if no address, go back
    }, [router]);

    if (!address) return null; // wait for address to load

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Order Confirmation</h1>

            {/* Delivery Address */}
            <div className="border p-4 rounded mb-6">
                <h2 className="font-semibold mb-2">Delivery Address</h2>
                <p>{address.name}</p>
                <p>{address.street}</p>
                <p>{address.city}, {address.zip}</p>
                <p>Phone: {address.phone}</p>
            </div>

            {/* Cart Items */}
            <div className="border p-4 rounded mb-6">
                <h2 className="font-semibold mb-2">Products</h2>
                {cart.map(item => (
                    <div key={item.id} className="flex justify-between border-b py-2">
                        <span>{item.name} x {item.quantity}</span>
                        <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                ))}
                <p className="font-bold mt-2">Total: ${total.toFixed(2)}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button onClick={() => router.push("/checkout/payment")}>Proceed to Payment</Button>
                <Button variant="outline" onClick={() => router.push("/cart")}>Edit Cart</Button>
            </div>
        </div>
    );
}
