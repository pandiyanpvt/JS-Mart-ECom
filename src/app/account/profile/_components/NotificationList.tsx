"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Trash2, Info, Clock } from "lucide-react";
import { notificationService } from "@/services";
import { type Notification } from "@/services/notification.service";
import toast from "react-hot-toast";

export function NotificationList() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getMyNotifications();
            setNotifications(data.items);
        } catch (error) {
            console.error("Failed to load notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            toast.error("Failed to mark as read");
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success("All notifications marked as read");
        } catch (error) {
            toast.error("Failed to mark all as read");
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                    {notifications.some(n => !n.isRead) && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-sm font-bold text-[#005000] hover:underline flex items-center gap-2"
                        >
                            <Check className="h-4 w-4" />
                            Mark all as read
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005000]"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-5 rounded-xl border transition-all ${notif.isRead
                                        ? "bg-white border-gray-100 opacity-75"
                                        : "bg-green-50/30 border-green-100 shadow-sm"
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className={`mt-1 p-2 rounded-lg shrink-0 ${notif.isRead ? "bg-gray-100 text-gray-400" : "bg-green-100 text-[#005000]"
                                        }`}>
                                        <Bell className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className={`font-bold text-sm ${notif.isRead ? "text-gray-700" : "text-gray-900"}`}>
                                                {notif.title}
                                            </h3>
                                            {!notif.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                    className="shrink-0 p-1 hover:bg-green-100 rounded text-[#005000] transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                                            {notif.message}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                                            <Clock className="h-3 w-3" />
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
