'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, ShieldCheck, Truck, Percent, Gift, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { membershipService, MembershipPlan, UserSubscription } from '@/services/membership.service';
import { useRouter } from 'next/navigation';

export default function MembershipPlans() {
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentSub, setCurrentSub] = useState<UserSubscription | null>(null);
    const [isProcessing, setIsProcessing] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            try {
                const [plansData, subData] = await Promise.all([
                    membershipService.getPlans(),
                    membershipService.getMySubscription()
                ]);
                setPlans(plansData.sort((a, b) => a.level - b.level));
                setCurrentSub(subData);
            } catch (error) {
                console.error('Failed to load membership data', error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSubscribe = async (plan: MembershipPlan) => {
        setIsProcessing(plan.id);
        try {
            // In a real app, this would open Stripe checkout
            // For now, we simulate success
            await membershipService.subscribe(plan.id, "MOCK_PAYMENT_" + Date.now());
            router.refresh();
            const sub = await membershipService.getMySubscription();
            setCurrentSub(sub);
            alert(`Welcome to ${plan.name}! Your subscription is now active.`);
        } catch (error: any) {
            alert(error.message || 'Subscription failed');
        } finally {
            setIsProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
                <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Loading Membership Tiers...</p>
            </div>
        );
    }

    return (
        <section className="py-20 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6"
                >
                    <Crown size={14} />
                    Elevate Your Shopping
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-zinc-900 mb-6 tracking-tight"
                >
                    Unlock the <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">JS Advantage</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-500 max-w-2xl mx-auto font-medium"
                >
                    Choose a plan that fits your lifestyle. Enjoy unlimited free shipping,
                    exclusive member prices, and priority rewards on every purchase.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {plans.map((plan, index) => {
                    const isPlus = plan.level === 2;
                    const isActive = currentSub?.planId === plan.id;
                    const features = JSON.parse(plan.features || '[]');

                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (index * 0.1) }}
                            className={cn(
                                "group relative p-1 rounded-[3rem] transition-all duration-500",
                                isPlus ? "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 shadow-xl shadow-orange-100" : "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-100",
                                isActive && "ring-4 ring-offset-4 ring-emerald-500"
                            )}
                        >
                            <div className="bg-white rounded-[2.8rem] h-full p-8 md:p-12 flex flex-col items-center">
                                {isActive && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-500 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                                        Active Membership
                                    </div>
                                )}

                                <div className={cn(
                                    "w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-lg transition-transform group-hover:scale-110 duration-500",
                                    isPlus ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"
                                )}>
                                    {isPlus ? <Crown size={40} strokeWidth={2.5} /> : <Zap size={40} strokeWidth={2.5} />}
                                </div>

                                <h3 className="text-3xl font-black text-zinc-900 mb-2">{plan.name}</h3>
                                <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-8">{isPlus ? 'Premium Experience' : 'Essential Benefits'}</p>

                                <div className="flex items-baseline gap-1 mb-10">
                                    <span className="text-5xl font-black text-zinc-900">AUD {plan.priceMonth}</span>
                                    <span className="text-zinc-400 font-black text-xs uppercase tracking-widest">/ month</span>
                                </div>

                                <div className="w-full space-y-5 mb-12 flex-1">
                                    {features.map((feature: string, i: number) => (
                                        <div key={i} className="flex items-center gap-4 text-zinc-600 group/item">
                                            <div className={cn(
                                                "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                                                isPlus ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"
                                            )}>
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                            <span className="text-sm font-bold">{feature}</span>
                                        </div>
                                    ))}

                                    {/* Standard Benefits always shown */}
                                    <div className="flex items-center gap-4 text-zinc-600 italic">
                                        <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                            <Truck size={14} />
                                        </div>
                                        <span className="text-sm font-black">Free Express Shipping</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-zinc-600 italic">
                                        <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                            <Percent size={14} />
                                        </div>
                                        <span className="text-sm font-black">Member-Only Offers</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={isActive || isProcessing !== null}
                                    className={cn(
                                        "w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg",
                                        isActive
                                            ? "bg-emerald-50 text-emerald-600 cursor-default"
                                            : isPlus
                                                ? "bg-zinc-900 text-white hover:bg-amber-600 hover:shadow-amber-200"
                                                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200"
                                    )}
                                >
                                    {isActive ? (
                                        <>
                                            <ShieldCheck size={20} />
                                            Your Current Tier
                                        </>
                                    ) : isProcessing === plan.id ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Initializing...
                                        </>
                                    ) : (
                                        <>
                                            {isPlus ? 'Upgrade to Plus' : 'Join JS Pro'}
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>

                                <p className="mt-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">
                                    Cancel anytime. No hidden fees.
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-20 text-center">
                <div className="inline-flex items-center gap-6 px-10 py-6 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
                    <div className="text-left">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Corporate or Bulk Membership?</p>
                        <p className="text-sm font-black text-zinc-900">Custom solutions for your organization</p>
                    </div>
                    <div className="w-[1px] h-8 bg-zinc-200" />
                    <button className="text-indigo-600 font-black text-sm hover:underline flex items-center gap-2">
                        Contact Sales <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}
