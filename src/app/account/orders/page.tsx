"use client";

import { useState, useEffect } from "react";
import { Package, Search, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { authService, orderService } from "@/services";

interface OrderDetail {
    id: number;
    productId: number;
    quantity: number;
    pricePerUnit: string;
}

interface Order {
    id: number;
    dateTime: string;
    totalAmount: string;
    status: string;
    details: OrderDetail[];
    trackingNumber?: string; // May not exist in backend yet or named differently
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = authService.getCurrentUser();
                if (!user?.id) {
                    setOrders([]);
                    return;
                }
                const data = await orderService.getMyOrders(user.id);
                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        const normalizedStatus = status?.toUpperCase() || "";
        switch (normalizedStatus) {
            case "COMPLETED":
            case "DELIVERED":
                return "text-green-700 bg-green-50 border-green-200";
            case "SHIPPED":
            case "IN TRANSIT":
                return "text-indigo-700 bg-indigo-50 border-indigo-200";
            case "PROCESSING":
                return "text-blue-700 bg-blue-50 border-blue-200";
            case "PENDING":
                return "text-amber-700 bg-amber-50 border-amber-200";
            case "CANCELLED":
            case "REFUNDED":
                return "text-red-700 bg-red-50 border-red-200";
            default:
                return "text-slate-600 bg-slate-50 border-slate-200";
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toString().includes(searchQuery) ||
            order.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filterStatus === "all" || order.status.toLowerCase() === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-[#253D4E]">
                    Order summary
                </h1>
                <p className="text-gray-600 mt-1">Your order history — only your orders are shown here</p>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 pb-12">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-[#253D4E] mb-2">Your orders</h2>
                                <p className="text-gray-600">Track and manage your order history</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Package className="h-5 w-5" />
                                <span className="font-semibold">{orders.length}</span> orders
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
                                    className="h-12 px-4 rounded-lg border border-gray-300 focus:border-[#00028C] focus:ring-[#00028C]"
                                >
                                    <option value="all">All Orders</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
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
                                                        #{order.id}
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
                                                    <span>Placed on {new Date(order.dateTime).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{order.details ? order.details.length : 0} items</span>
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
                                                        AUD {Number(order.totalAmount || 0).toFixed(2)}
                                                    </p>
                                                </div>
                                                <Link href={`/account/orders/${order.id}`}>
                                                    <Button className="bg-[#00028C] hover:bg-[#00026e]">
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
                                            <button className="text-sm text-[#005000] hover:text-[#006600] font-medium">
                                                Buy Again
                                            </button>
                                            <span className="text-gray-300">•</span>
                                            <button className="text-sm text-[#005000] hover:text-[#006600] font-medium">
                                                Write Review
                                            </button>
                                            <span className="text-gray-300">•</span>
                                            <button className="text-sm text-[#005000] hover:text-[#006600] font-medium">
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
