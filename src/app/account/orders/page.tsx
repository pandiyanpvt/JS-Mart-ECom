"use client";

import { useState } from "react";
import { Package, Search, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Order {
    id: string;
    date: string;
    items: number;
    total: string;
    status: "Delivered" | "In Transit" | "Processing" | "Cancelled";
    trackingNumber?: string;
}

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const orders: Order[] = [
        {
            id: "ORD-2024-1234",
            date: "Jan 10, 2026",
            items: 3,
            total: "$124.99",
            status: "Delivered",
            trackingNumber: "TRK123456789",
        },
        {
            id: "ORD-2024-1235",
            date: "Jan 08, 2026",
            items: 1,
            total: "$45.50",
            status: "In Transit",
            trackingNumber: "TRK987654321",
        },
        {
            id: "ORD-2024-1236",
            date: "Jan 05, 2026",
            items: 5,
            total: "$289.00",
            status: "Processing",
        },
        {
            id: "ORD-2024-1237",
            date: "Dec 28, 2025",
            items: 2,
            total: "$78.25",
            status: "Delivered",
            trackingNumber: "TRK456789123",
        },
        {
            id: "ORD-2024-1238",
            date: "Dec 20, 2025",
            items: 1,
            total: "$32.99",
            status: "Cancelled",
        },
    ];

    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "Delivered":
                return "text-green-600 bg-green-50 border-green-200";
            case "In Transit":
                return "text-blue-600 bg-blue-50 border-blue-200";
            case "Processing":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "Cancelled":
                return "text-red-600 bg-red-50 border-red-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filterStatus === "all" || order.status.toLowerCase() === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 pb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    My Orders
                </h1>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-12">
                <div className="space-y-6">
                    {/* Header */}
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

                        {/* Search and Filter */}
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
                                    <option value="processing">Processing</option>
                                    <option value="in transit">In Transit</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-4">
                        {filteredOrders.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No orders found
                                </h3>
                                <p className="text-gray-600">
                                    Try adjusting your search or filter criteria
                                </p>
                            </div>
                        ) : (
                            filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            {/* Order Info */}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        {order.id}
                                                    </h3>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                            order.status
                                                        )}`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                    <span>Placed on {order.date}</span>
                                                    <span>•</span>
                                                    <span>{order.items} items</span>
                                                    {order.trackingNumber && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="font-mono">
                                                                {order.trackingNumber}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Price and Action */}
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600 mb-1">Total</p>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {order.total}
                                                    </p>
                                                </div>
                                                <Link href={`/account/orders/${order.id}`}>
                                                    <Button className="bg-[#3BB77E] hover:bg-[#299E63]">
                                                        View Details
                                                        <ChevronRight className="h-4 w-4 ml-1" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Quick Actions */}
                                    {order.status === "Delivered" && (
                                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex flex-wrap gap-3">
                                            <button className="text-sm text-[#3BB77E] hover:text-[#299E63] font-medium">
                                                Buy Again
                                            </button>
                                            <span className="text-gray-300">•</span>
                                            <button className="text-sm text-[#3BB77E] hover:text-[#299E63] font-medium">
                                                Write Review
                                            </button>
                                            <span className="text-gray-300">•</span>
                                            <button className="text-sm text-[#3BB77E] hover:text-[#299E63] font-medium">
                                                Download Invoice
                                            </button>
                                        </div>
                                    )}

                                    {order.status === "In Transit" && (
                                        <div className="bg-blue-50 px-6 py-3 border-t border-blue-100">
                                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                                Track Package →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
