"use client";

import { useState, useEffect } from "react";
import { Package, ChevronRight, Search, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orderService } from "@/services";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-12 h-12 border-4 border-[#005000]/20 border-t-[#005000] rounded-full animate-spin" />
                            <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Fetching your orders...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200">
                            <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold">No orders found matching your search</p>
                        </div>
                    ) : (
                        <div className="grid gap-5">
                            {filteredOrders.map((order) => {
                                const status = (order.status || 'PENDING').toUpperCase();

                                // Color Map
                                const statusColors: any = {
                                    'PENDING': 'bg-amber-50 text-amber-600 border-amber-100',
                                    'PROCESSING': 'bg-blue-50 text-blue-600 border-blue-100',
                                    'SHIPPED': 'bg-indigo-50 text-indigo-600 border-indigo-100',
                                    'DELIVERED': 'bg-emerald-50 text-emerald-600 border-emerald-100',
                                    'COMPLETED': 'bg-green-50 text-green-700 border-green-200 shadow-sm shadow-green-100',
                                    'CANCELLED': 'bg-rose-50 text-rose-600 border-rose-100',
                                };

                                return (
                                    <div key={order.id} className="group relative bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-7 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,80,0,0.08)] hover:-translate-y-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-[#005000]/5 transition-colors">
                                                    <Package className="h-6 w-6 text-gray-400 group-hover:text-[#005000]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Order #{order.id}</h3>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                                        Placed on {new Date(order.dateTime).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border self-start sm:self-center transition-all",
                                                statusColors[status] || 'bg-gray-50 text-gray-500 border-gray-100'
                                            )}>
                                                {status}
                                            </div>
                                        </div>

                                        {order.deliveryAgent && (status === 'SHIPPED' || status === 'DELIVERED') && (
                                            <div className="mb-6 flex items-center gap-3 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 animate-in fade-in slide-in-from-top-2 duration-700">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                                                    <Truck className="h-4 w-4" />
                                                </div>
                                                <p className="text-xs font-bold text-indigo-700">
                                                    <span className="opacity-70 font-medium">Delivery Partner:</span> {order.deliveryAgent.fullName} <span className="opacity-70 font-medium">will deliver your order shortly.</span>
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-50 gap-6">
                                            <div className="flex items-center gap-10 w-full sm:w-auto overflow-x-auto scrollbar-hide">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                                    <p className="text-xl font-black text-gray-900 leading-none">
                                                        <span className="text-sm font-bold text-gray-400 mr-1">AUD</span>
                                                        {parseFloat(order.totalAmount).toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="hidden sm:block">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                                                    <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                                                        {order.paymentType?.type || 'Online Payment'}
                                                    </p>
                                                </div>
                                            </div>

                                            <Link href={`/account/orders/${order.id}`} className="w-full sm:w-auto">
                                                <Button className="w-full sm:w-auto bg-gray-900 hover:bg-[#005000] text-white rounded-2xl px-8 py-6 font-black text-xs uppercase tracking-widest transition-all hover:shadow-xl hover:shadow-[#005000]/20 active:scale-95 flex items-center gap-2">
                                                    View Order Details
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
