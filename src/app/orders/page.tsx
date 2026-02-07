'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, Filter, ChevronRight } from "lucide-react";

// Types
type OrderItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    category?: string;
};

type Order = {
    id: string;
    items: OrderItem[];
    total: number;
    status: string;
    createdAt: string;
    trackingNumber?: string;
    address: {
        name: string;
        street?: string;
        city?: string;
        zip?: string;
    };
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Load orders from localStorage and normalize
    useEffect(() => {
        const storedOrders = localStorage.getItem("orders");
        if (storedOrders) {
            const parsed: Order[] = JSON.parse(storedOrders);
            const normalized = parsed.map(order => ({
                ...order,
                items: order.items || [], // fallback to empty array
                address: order.address || { name: "", street: "", city: "", zip: "" },
            }));
            setOrders(normalized);
        }
        setLoading(false);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "shipped":
            case "in transit":
                return "text-blue-600 bg-blue-50 border-blue-200";
            case "delivered":
            case "completed":
                return "text-green-600 bg-green-50 border-green-200";
            case "cancelled":
                return "text-red-600 bg-red-50 border-red-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const filteredOrders = orders.filter(order => {
        const orderId = order.id?.toString() ?? "";
        const orderStatus = order.status?.toString() ?? "";
        const trackingNumber = order.trackingNumber?.toString() ?? "";
        const matchesSearch =
            orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            filterStatus === "all" || orderStatus.toLowerCase() === filterStatus;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 pb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Orders</h1>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-12 space-y-6">
                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h2>
                            <p className="text-gray-600">Track and manage your orders</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Package className="h-5 w-5" />
                            <span className="font-semibold">{orders.length}</span> Total Orders
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by order ID or tracking number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="h-12 px-4 rounded-lg border border-gray-300 focus:border-[#3BB77E] focus:ring-[#3BB77E]"
                            >
                                <option value="all">All Orders</option>
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading orders...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        filteredOrders.map(order => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                            >
                                <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Order Info */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-lg font-bold text-gray-900">#{order.id}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                            <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span>
                        • {order.items?.length ?? 0} {(order.items?.length ?? 0) > 1 ? "items" : "item"}
                      </span>
                                            {order.trackingNumber && (
                                                <>
                                                    <span>•</span>
                                                    <span className="font-mono">{order.trackingNumber}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Ship to: {order.address?.name}, {order.address?.street}, {order.address?.city}
                                        </div>
                                    </div>

                                    {/* Total & Action */}
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 mb-1">Total</p>
                                            <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                                        </div>
                                        <Link href={`/orders/${order.id}`}>
                                            <Button className="bg-[#3BB77E] hover:bg-[#299E63]">
                                                View Details
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
