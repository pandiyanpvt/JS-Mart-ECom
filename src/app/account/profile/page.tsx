"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    User,
    ShoppingBag,
    MessageSquare,
    MapPin,
    Star,
    Crown,
    ChevronRight,
    LogOut,
    Bell,
    Zap,
    Gem
} from "lucide-react";
import Cookies from "js-cookie";
import { userService } from "@/services";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

// Sub-components
import { ProfileDetails } from "./_components/ProfileDetails";
import { OrderList } from "./_components/OrderList";
import { ReviewList } from "./_components/ReviewList";
import { AddressBook } from "./_components/AddressBook";
import { PointsSummary } from "./_components/PointsSummary";
import { MembershipInfo } from "./_components/MembershipInfo";
import { NotificationList } from "./_components/NotificationList";

export default function ProfilePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("profile");

    const menuItems = [
        { id: "profile", label: "My Profile", icon: User },
        { id: "orders", label: "My Orders", icon: ShoppingBag },
        { id: "reviews", label: "My Reviews", icon: MessageSquare },
        { id: "addresses", label: "Shipping Address", icon: MapPin },
        { id: "points", label: "My Points", icon: Star },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "membership", label: "Membership", icon: Crown },
    ];

    // Handle tab from query param
    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && menuItems.some(item => item.id === tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/signin?redirect=/account/profile");
            return;
        }

        userService.getProfile()
            .then((userData) => {
                if (userData) {
                    setUser(userData);
                    Cookies.set("user", JSON.stringify(userData), { expires: 1 });
                    window.dispatchEvent(new Event("auth-change"));
                }
            })
            .catch(() => toast.error("Failed to load profile"))
            .finally(() => setLoading(false));
    }, [router]);

    const handleUserUpdate = (updatedUser: any) => {
        setUser(updatedUser);
        Cookies.set("user", JSON.stringify(updatedUser), { expires: 1 });
        window.dispatchEvent(new Event("auth-change"));
    };

    const handleLogout = async () => {
        try {
            const { signOut } = await import("next-auth/react");
            await signOut({ redirect: false });
            Cookies.remove("token");
            Cookies.remove("user");
            toast.success("Logged out successfully");
            router.push("/");
            window.location.reload();
        } catch (error) {
            console.error("Logout error:", error);
            Cookies.remove("token");
            Cookies.remove("user");
            router.push("/");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005000]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12 sm:pb-16 md:pb-20">
            {/* Top Banner / Header Area */}
            <div className="bg-[#005000] text-white pt-6 sm:pt-8 md:pt-12 pb-16 sm:pb-20 md:pb-24 px-3 sm:px-4 md:px-8 lg:px-12">
                <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                        <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full border-2 sm:border-3 md:border-4 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center shadow-xl flex-shrink-0">
                            {user?.profileImg ? (
                                <img src={user.profileImg} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight truncate">
                                    Hello, {user?.fullName || "User"}!
                                </h1>
                                {user?.activeSubscription?.plan && (
                                    <span className={cn(
                                        "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md border border-white/20 shrink-0",
                                        user.activeSubscription.plan.level === 2 ? "bg-amber-500" : "bg-indigo-600"
                                    )}>
                                        {user.activeSubscription.plan.level === 2 ? <Gem size={10} className="sm:w-3 sm:h-3" /> : <Zap size={10} className="sm:w-3 sm:h-3" />}
                                        <span className="hidden sm:inline">{user.activeSubscription.plan.name} MEMBER</span>
                                        <span className="sm:hidden">{user.activeSubscription.plan.name}</span>
                                    </span>
                                )}
                            </div>
                            <p className="text-green-100 opacity-80 mt-0.5 sm:mt-1 text-xs sm:text-sm">Manage your profile, orders, and rewards here.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <button
                            onClick={() => setActiveTab("notifications")}
                            className={`h-10 w-10 sm:h-11 sm:w-11 rounded-full flex items-center justify-center transition-all relative min-h-[44px] min-w-[44px] touch-manipulation ${activeTab === "notifications" ? "bg-white text-[#005000]" : "bg-white/10 hover:bg-white/20"
                                }`}
                        >
                            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-2 w-2 bg-red-500 rounded-full border border-[#005000]"></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-[1700px] mx-auto px-3 sm:px-4 md:px-8 lg:px-12 -mt-8 sm:-mt-10 md:-mt-12">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-10">
                    {/* Left Sidebar */}
                    <aside className="w-full lg:w-[350px] shrink-0">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden lg:sticky lg:top-24">
                            <div className="p-4 sm:p-5 md:p-6 border-b border-gray-50">
                                <h3 className="font-bold text-gray-900 uppercase tracking-widest text-[10px] sm:text-xs">Account Menu</h3>
                            </div>
                            <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setActiveTab(item.id);
                                                window.history.pushState(null, '', `/account/profile?tab=${item.id}`);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 sm:px-4 md:px-5 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl transition-all group min-h-[48px] touch-manipulation ${isActive
                                                ? "bg-[#005000] text-white shadow-lg shadow-[#005000]/20"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                                <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${isActive ? "bg-white/10" : "bg-gray-100 group-hover:bg-white"}`}>
                                                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                                </div>
                                                <span className="font-bold text-xs sm:text-sm tracking-wide">{item.label}</span>
                                                {item.id === "membership" && user?.activeSubscription?.plan && (
                                                    <div className={cn(
                                                        "ml-1 sm:ml-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse",
                                                        user.activeSubscription.plan.level === 2 ? "bg-amber-400" : "bg-indigo-400"
                                                    )} />
                                                )}
                                            </div>
                                            <ChevronRight className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform shrink-0 ${isActive ? "translate-x-1 opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                                        </button>
                                    );
                                })}
                                <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-100 px-2 pb-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-colors min-h-[48px] touch-manipulation"
                                    >
                                        <div className="p-1.5 sm:p-2 rounded-lg bg-red-50 shrink-0">
                                            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        Logout Account
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* Right Content Area */}
                    <main className="flex-1 min-w-0">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {activeTab === "profile" && (
                                <ProfileDetails user={user} onUpdate={handleUserUpdate} />
                            )}
                            {activeTab === "orders" && (
                                <OrderList userId={user.id} />
                            )}
                            {activeTab === "reviews" && (
                                <ReviewList />
                            )}
                            {activeTab === "addresses" && (
                                <AddressBook />
                            )}
                            {activeTab === "points" && (
                                <PointsSummary />
                            )}
                            {activeTab === "notifications" && (
                                <NotificationList />
                            )}
                            {activeTab === "membership" && (
                                <MembershipInfo user={user} />
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
