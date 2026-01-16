"use client";

import { useRouter } from "next/navigation";
import {
    Package,
    MapPin,
    CreditCard,
    Truck,
    CheckCircle,
    Clock,
    ChevronLeft,
    Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();

    // Mock order data - in a real app, this would be fetched based on params.id
    const order = {
        id: params.id,
        date: "Jan 10, 2026",
        status: "Delivered",
        deliveredDate: "Jan 12, 2026",
        trackingNumber: "TRK123456789",
        items: [
            {
                id: 1,
                name: "Organic Avocados (Pack of 4)",
                image: "/products/avocado.jpg",
                price: 12.99,
                quantity: 2,
                category: "Fresh Produce",
            },
            {
                id: 2,
                name: "Free Range Eggs (12 pack)",
                image: "/products/eggs.jpg",
                price: 8.99,
                quantity: 1,
                category: "Dairy & Eggs",
            },
        ],
        subtotal: 34.97,
        shipping: 5.99,
        tax: 4.08,
        total: 45.04,
        shippingAddress: {
            name: "John Doe",
            street: "123 Market Street",
            city: "Sydney",
            state: "NSW",
            zip: "2000",
            country: "Australia",
        },
        paymentMethod: {
            type: "Visa",
            last4: "4242",
        },
        trackingSteps: [
            {
                status: "Order Placed",
                date: "Jan 10, 2026 10:30 AM",
                completed: true,
            },
            {
                status: "Order Confirmed",
                date: "Jan 10, 2026 11:00 AM",
                completed: true,
            },
            {
                status: "Shipped",
                date: "Jan 11, 2026 09:15 AM",
                completed: true,
            },
            {
                status: "Out for Delivery",
                date: "Jan 12, 2026 08:00 AM",
                completed: true,
            },
            {
                status: "Delivered",
                date: "Jan 12, 2026 02:30 PM",
                completed: true,
            },
        ],
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ChevronLeft className="h-5 w-5" />
                    Back to Orders
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Order {order.id}
                        </h2>
                        <p className="text-gray-600">
                            Placed on {order.date} • {order.items.length} items
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Invoice
                        </Button>
                        <Button className="bg-lime-500 hover:bg-lime-600">
                            <Truck className="h-4 w-4 mr-2" />
                            Track Order
                        </Button>
                    </div>
                </div>
            </div>

            {/* Order Tracking */}
            <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Tracking</h3>

                <div className="relative">
                    {order.trackingSteps.map((step, index) => (
                        <div key={index} className="flex gap-4 pb-8 last:pb-0">
                            {/* Timeline Line */}
                            <div className="relative flex flex-col items-center">
                                <div
                                    className={`h-10 w-10 rounded-full flex items-center justify-center ${step.completed
                                            ? "bg-lime-500 text-white"
                                            : "bg-gray-200 text-gray-400"
                                        }`}
                                >
                                    {step.completed ? (
                                        <CheckCircle className="h-6 w-6" />
                                    ) : (
                                        <Clock className="h-6 w-6" />
                                    )}
                                </div>
                                {index < order.trackingSteps.length - 1 && (
                                    <div
                                        className={`w-0.5 flex-1 my-2 ${step.completed ? "bg-lime-500" : "bg-gray-200"
                                            }`}
                                        style={{ minHeight: "40px" }}
                                    />
                                )}
                            </div>

                            {/* Step Details */}
                            <div className="flex-1 pt-2">
                                <p
                                    className={`font-semibold ${step.completed ? "text-gray-900" : "text-gray-400"
                                        }`}
                                >
                                    {step.status}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">{step.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Items</h3>

                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:border-lime-500 transition-colors"
                        >
                            <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Quantity: {item.quantity}
                                </p>
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

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-3 max-w-md ml-auto">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>${order.shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <MapPin className="h-6 w-6 text-lime-600" />
                        <h3 className="text-lg font-bold text-gray-900">Shipping Address</h3>
                    </div>
                    <div className="text-gray-600 space-y-1">
                        <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                            {order.shippingAddress.zip}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <CreditCard className="h-6 w-6 text-lime-600" />
                        <h3 className="text-lg font-bold text-gray-900">Payment Method</h3>
                    </div>
                    <div className="text-gray-600">
                        <p className="font-semibold text-gray-900">
                            {order.paymentMethod.type} ending in {order.paymentMethod.last4}
                        </p>
                        <p className="text-sm mt-2">
                            <span className="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                                Payment Successful
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
