"use client";

import { useEffect, useState } from "react";
import { Crown, Sparkles, Loader2, CheckCircle2, Calendar, CreditCard, ArrowRight, Zap, Gem, Truck, Percent } from "lucide-react";
import { membershipService, UserSubscription } from "@/services/membership.service";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { VirtualMembershipCard } from "./VirtualMembershipCard";

export function MembershipInfo({ user }: { user: any }) {
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        membershipService.getMySubscription()
            .then(setSubscription)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Verifying Status...</p>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12 overflow-hidden relative">
                    <div className="absolute -right-20 -top-20 opacity-[0.03] text-indigo-900 pointer-events-none">
                        <Crown size={400} />
                    </div>

                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Crown size={40} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Become a <span className="text-indigo-600">JS Pro</span> Member</h2>
                        <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                            Join our premium program to unlock free express shipping, exclusive member-only pricing,
                            and priority early access to new collections.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
                            {[
                                "Unlimited Free Shipping",
                                "Up to 50% Exclusive Member Discounts",
                                "Double Points on all purchases",
                                "Priority Customer Support"
                            ].map((feat, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <CheckCircle2 className="text-indigo-500" size={18} />
                                    {feat}
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/membership"
                            className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-zinc-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 group"
                        >
                            View Membership Tiers
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isPlus = subscription.plan?.level === 2;
    const features = JSON.parse(subscription.plan?.features || '[]');

    return (
        <div className="space-y-16 pb-20">
            {/* Virtual Membership Card Section */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <VirtualMembershipCard user={user} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Benefits & Perks Column */}
                <div className="lg:col-span-2 space-y-10">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Member Benefits</h3>
                        <p className="text-gray-500 font-medium">Exclusive perks unlocked for your account.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { icon: Truck, title: 'Express Shipping', desc: 'Complimentary shipping on all orders', color: 'text-blue-600', bg: 'bg-blue-50' },
                            { icon: Percent, title: 'VIP Pricing', desc: 'Up to 25% off storewide discounts', color: 'text-amber-600', bg: 'bg-amber-50' },
                            { icon: Zap, title: 'Early Access', desc: 'Shop new drops 24h before everyone', color: 'text-purple-600', bg: 'bg-purple-50' },
                            { icon: Gem, title: 'Luxury Support', desc: '24/7 priority concierge service', color: 'text-rose-600', bg: 'bg-rose-50' }
                        ].map((item, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                                key={i}
                                className="group p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:translate-y-[-4px]"
                            >
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", item.bg, item.color)}>
                                    <item.icon size={26} />
                                </div>
                                <h4 className="font-black text-lg text-gray-900 mb-2">{item.title}</h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-1 max-w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-xl">
                        <div className="bg-zinc-900 rounded-[2.4rem] p-8 md:p-12 text-white relative flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black tracking-tight leading-none">Ready for an Upgrade?</h3>
                                <p className="text-gray-400 font-medium max-w-md">Unlock the full JS PRO experience including global lounge access and custom product engraving.</p>
                            </div>
                            <Link href="/membership" className="shrink-0 bg-white text-zinc-900 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all shadow-2xl">
                                Explore Plans
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Account Status Sidebar Column */}
                <div className="space-y-10">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 space-y-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-4">Subscription</h3>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                                    isPlus ? "bg-amber-400 text-zinc-900" : "bg-indigo-600 text-white"
                                )}>
                                    {isPlus ? <Gem size={24} /> : <Zap size={24} />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Active Plan</p>
                                    <p className="font-black text-gray-900">{subscription.plan?.name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest text-[10px]">Renewal Status</span>
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Active
                                </div>
                            </div>
                            <div className="space-y-1 px-2">
                                <p className="text-xs font-black text-gray-900">Next billing cycle on {new Date(subscription.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p className="text-[11px] text-gray-400 font-medium">Automatic renewal is currently enabled.</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50 space-y-3">
                            <button className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg">
                                Manage Payment
                            </button>
                            <button className="w-full py-4 text-rose-600 hover:bg-rose-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                                Cancel Subscription
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 space-y-6">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Recent Benefits</h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Free Shipping Applied', date: 'Yesterday', icon: Truck, color: 'text-blue-500' },
                                { title: 'Points Multiplier (x2) Active', date: '3 days ago', icon: Zap, color: 'text-amber-500' },
                                { title: 'Secret Drop Access', date: '1 week ago', icon: Sparkles, color: 'text-purple-500' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                    <div className={cn("w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 transition-all group-hover:scale-110", item.color)}>
                                        <item.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 leading-tight">{item.title}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
