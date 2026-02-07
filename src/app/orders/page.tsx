'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Order = {
    id: string;
    total: number;
    shippingMethod: string;
    paymentMethod: string;
    status: string;
    createdAt: string;
    address: {
        name: string;
        street?: string;
        city?: string;
        zip?: string;
    };
};

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedOrders = localStorage.getItem("orders");
        if (storedOrders) setOrders(JSON.parse(storedOrders));
        setLoading(false);
    }, []);

    const handleReturn = () => router.push("/shop");

    if (loading) return <p className="p-6 text-center">Loading orders...</p>;
    if (!orders.length) return (
        <div className="p-6 text-center text-gray-500 font-medium">
            Your orders list is empty —{" "}
            <Link href="/shop" className="underline text-emerald-600">
                Start Shopping
            </Link>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>

            <div className="overflow-x-auto">
                <table className="w-full table-auto text-left">
                    <thead className="text-gray-500 text-sm  font-medium">
                    <tr>
                        <th className="px-6 py-3 w-[35%]">Order ID</th>
                        <th className="px-6 py-3 w-[20%]">Placed On</th>
                        <th className="px-6 py-3 w-[15%] text-end">Total</th>
                        <th className="px-6 py-3 w-[15%] text-end">Status</th>
                        <th className="px-6 py-3 w-[15%] text-end">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-3 font-medium text-gray-700 truncate">{order.id}</td>
                            <td className="px-6 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-3 text-end font-bold">${order.total.toFixed(2)}</td>
                            <td className="px-6 py-3 text-end">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        order.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                                            order.status === "Shipped" ? "bg-blue-100 text-blue-600" :
                                                order.status === "Delivered" ? "bg-green-100 text-green-600" :
                                                    "bg-gray-100 text-gray-600"
                                    }`}>
                                        {order.status}
                                    </span>
                            </td>
                            <td className="px-6 py-3 text-end">
                                <Link href={`/orders/${order.id}`} className="text-cyan-600 underline text-sm">
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-end">
                <Button onClick={handleReturn} className="text-sm">
                    Return to Shop
                </Button>
            </div>
        </div>
    );
}
