"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AddressPage() {
    const router = useRouter();
    const [address, setAddress] = useState({
        name: "",
        street: "",
        city: "",
        zip: "",
        phone: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // save to context or local storage
        router.push("/checkout/payment");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Delivery Address</h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <input type="text" placeholder="Full Name" required className="w-full border rounded px-3 py-2"
                       value={address.name} onChange={e => setAddress({...address, name: e.target.value})} />
                <input type="text" placeholder="Street Address" required className="w-full border rounded px-3 py-2"
                       value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                <input type="text" placeholder="City" required className="w-full border rounded px-3 py-2"
                       value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                <input type="text" placeholder="ZIP / Postal Code" required className="w-full border rounded px-3 py-2"
                       value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} />
                <input type="text" placeholder="Phone Number" required className="w-full border rounded px-3 py-2"
                       value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
                <Button type="submit">Checkout</Button>
            </form>
        </div>
    );
}
