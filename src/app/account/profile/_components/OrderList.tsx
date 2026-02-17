"use client";

import { useState, useEffect } from "react";
import { Package, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orderService } from "@/services";
import Link from "next/link";

export function OrderList({ userId }: { userId: number }) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        orderService.getMyOrders(userId)
            .then(data => setOrders(Array.isArray(data) ? data : []))
            .finally(() => setLoading(false));
    }, [userId]);

    const filteredOrders = orders.filter(o =>
        o.id.toString().includes(searchQuery) ||
        o.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
                    <div className="text-sm text-gray-500 font-medium">
                        Total {orders.length} orders
                    </div>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Search by order ID or status..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <p className="text-center py-8 text-gray-500">Loading orders...</p>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No orders found</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="font-bold text-gray-900">Order #{order.id}</p>
                                        <p className="text-sm text-gray-500">{new Date(order.dateTime).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Amount</p>
                                        <p className="font-bold text-gray-900">AUD {parseFloat(order.totalAmount).toFixed(2)}</p>
                                    </div>
                                    <Link href={`/account/orders/${order.id}`}>
                                        <Button variant="ghost" className="text-[#005000] hover:text-[#006600] font-bold">
                                            View Details
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
