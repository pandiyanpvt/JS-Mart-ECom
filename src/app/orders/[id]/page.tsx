'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Package, MapPin, CreditCard, Truck, CheckCircle, Clock, ChevronLeft, Download } from "lucide-react";

type OrderItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    category?: string;
};

type Order = {
    id: string;
    total: number;
    shippingMethod: string;
    paymentMethod: string;
    status: string;
    createdAt: string;
    trackingNumber?: string;
    items: OrderItem[];
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

    if (!order)
        return (
            <p className="p-6 text-center text-gray-500 font-medium">
                Order not found.
            </p>
        );

    const statusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-600";
            case "shipped":
                return "bg-blue-100 text-blue-600";
            case "delivered":
                return "bg-green-100 text-green-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <ChevronLeft className="h-5 w-5" />
                    Back to Orders
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                    <p className="text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items ? order.items.length : 0} items
                    </p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Invoice
                    </Button>
                    <Button className="bg-lime-500 hover:bg-lime-600">
                        <Truck className="h-4 w-4 mr-1" />
                        Track Order
                    </Button>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Order Items</h2>
                <div className="space-y-4">
                    {order.items.map(item => (
                        <div
                            key={item.id}
                            className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:border-lime-500 transition-colors"
                        >
                            <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                {item.category && (
                                    <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                                )}
                                <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-600">${item.price} each</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 max-w-md ml-auto">
                    <div className="flex justify-between text-gray-600">
                        <span>Total</span>
                        <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Payment Method</span>
                        <span>{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping Method</span>
                        <span>{order.shippingMethod}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                        <span>Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                    <MapPin className="h-6 w-6 text-lime-600" />
                    <h3 className="text-lg font-bold text-gray-900">Shipping Address</h3>
                </div>
                <div className="text-gray-600 space-y-1">
                    <p className="font-semibold text-gray-900">{order.address.name}</p>
                    {order.address.street && <p>{order.address.street}</p>}
                    {order.address.city && <p>{order.address.city}</p>}
                    {order.address.zip && <p>{order.address.zip}</p>}
                </div>
            </div>

            {/* Back Button */}
            <div className="mt-6">
                <Button
                    onClick={() => router.back()}
                    className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold"
                >
                    Back to Orders
                </Button>
            </div>
        </div>
    );
}
