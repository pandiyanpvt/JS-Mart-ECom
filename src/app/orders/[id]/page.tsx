'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function OrderViewPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        const storedOrders = localStorage.getItem("orders");
        if (storedOrders) {
            const orders: Order[] = JSON.parse(storedOrders);
            const found = orders.find(o => o.id === id);
            setOrder(found || null);
        }
    }, [id]);

    if (!order) return <p className="p-6 text-center text-gray-500 font-medium">Order not found.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Button onClick={() => router.back()} className="mb-4 text-sm">← Back to Orders</Button>

            <h1 className="text-3xl font-extrabold tracking-tight">Order #{order.id.slice(0, 8)}...</h1>
            <p className="text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-lg font-bold mb-3">Shipping Address</h2>
                    <p className="font-medium">{order.address.name}</p>
                    {order.address.street && <p>{order.address.street}</p>}
                    {order.address.city && <p>{order.address.city}</p>}
                    {order.address.zip && <p>{order.address.zip}</p>}
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition space-y-3">
                    <h2 className="text-lg font-bold">Order Summary</h2>
                    <p>Total: <span className="font-extrabold text-emerald-600">${order.total.toFixed(2)}</span></p>
                    <p>Payment Method: <span className="font-medium">{order.paymentMethod}</span></p>
                    <p>Shipping Method: <span className="font-medium">{order.shippingMethod}</span></p>
                    <p>Status:
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                                order.status === "Shipped" ? "bg-blue-100 text-blue-600" :
                                    order.status === "Delivered" ? "bg-green-100 text-green-600" :
                                        "bg-gray-100 text-gray-600"
                        }`}>
                            {order.status}
                        </span>
                    </p>
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-6">
                <Button onClick={() => router.back()} className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold">
                    Back to Orders
                </Button>
            </div>
        </div>
    );
}
