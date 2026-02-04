"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingBag, MapPin, CreditCard, TrendingUp } from "lucide-react";
import Cookies from 'js-cookie';

export default function AccountDashboard() {
    // ... (keep state and effects)
    const [userName, setUserName] = useState("User");

    useEffect(() => {
        const updateUserName = () => {
            const user = Cookies.get("user");
            if (user) {
                try {
                    const userData = JSON.parse(user);
                    // Construct full name if possible
                    let fullName = "User";
                    if (userData.firstName && userData.lastName) {
                        fullName = `${userData.firstName} ${userData.lastName}`;
                    } else if (userData.fullName) {
                        fullName = userData.fullName;
                    } else if (userData.firstName) {
                        fullName = userData.firstName;
                    } else if (userData.name) {
                        fullName = userData.name;
                    }
                    setUserName(fullName);
                } catch (error) {
                    console.error("Error parsing user data:", error);
                }
            }
        };

        // Initial load
        updateUserName();

        // Listen for user updates
        window.addEventListener("auth-change", updateUserName);

        return () => {
            window.removeEventListener("auth-change", updateUserName);
        };
    }, []);

    const stats = [
        // ... (keep stats array)
        {
            label: "Total Orders",
            value: "24",
            icon: Package,
            color: "bg-[#3BB77E]",
            trend: "+12% this month",
        },
        {
            label: "Active Orders",
            value: "3",
            icon: ShoppingBag,
            color: "bg-[#3BB77E]",
            trend: "2 in transit",
        },
        {
            label: "Saved Addresses",
            value: "4",
            icon: MapPin,
            color: "bg-purple-500",
            trend: "1 default",
        },
        {
            label: "Payment Methods",
            value: "2",
            icon: CreditCard,
            color: "bg-orange-500",
            trend: "All verified",
        },
    ];

    const recentOrders = [
        // ... (keep recentOrders array)
        {
            id: "ORD-2024-1234",
            date: "Jan 10, 2026",
            items: 3,
            total: "$124.99",
            status: "Delivered",
            statusColor: "text-green-600 bg-green-50",
        },
        {
            id: "ORD-2024-1235",
            date: "Jan 08, 2026",
            items: 1,
            total: "$45.50",
            status: "In Transit",
            statusColor: "text-blue-600 bg-blue-50",
        },
        {
            id: "ORD-2024-1236",
            date: "Jan 05, 2026",
            items: 5,
            total: "$289.00",
            status: "Processing",
            statusColor: "text-yellow-600 bg-yellow-50",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 pb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    My Account
                </h1>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-12 space-y-8">
                {/* Welcome Section */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome back, {userName}! 👋
                    </h2>
                    <p className="text-gray-600">
                        Here's what's happening with your account today.
                    </p>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <TrendingUp className="h-3 w-3" />
                                    {stat.trend}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
                        <a
                            href="/account/orders"
                            className="text-[#3BB77E] hover:text-[#299E63] font-medium text-sm"
                        >
                            View All →
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Order ID
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Date
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Items
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Total
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <a
                                                href={`/account/orders/${order.id}`}
                                                className="text-[#3BB77E] hover:text-[#299E63] font-medium"
                                            >
                                                {order.id}
                                            </a>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">{order.date}</td>
                                        <td className="py-4 px-4 text-gray-600">
                                            {order.items} items
                                        </td>
                                        <td className="py-4 px-4 font-semibold text-gray-900">
                                            {order.total}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${order.statusColor}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-[#3BB77E] to-[#299E63] rounded-xl shadow-md p-8 text-white">
                        <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                        <p className="text-lime-100 mb-4">
                            Our support team is ready to assist you
                        </p>
                        <button className="bg-white text-[#3BB77E] px-6 py-2 rounded-lg font-semibold hover:bg-[#3BB77E]/10 transition-colors">
                            Contact Support
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-[#3BB77E] to-[#299E63] rounded-xl shadow-md p-8 text-white">
                        <h3 className="text-xl font-bold mb-2">Track Your Order</h3>
                        <p className="text-purple-100 mb-4">
                            Get real-time updates on your deliveries
                        </p>
                        <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                            Track Package
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
