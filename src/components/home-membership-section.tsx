"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Zap, Check } from "lucide-react";
import { membershipService, type MembershipPlan } from "@/services/membership.service";

export default function HomeMembershipSection() {
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        membershipService
            .getPlans()
            .then((data) => setPlans((data || []).filter((p) => p.isActive).sort((a, b) => a.level - b.level)))
            .catch(() => setPlans([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading || plans.length === 0) return null;

    return (
        <section className="w-full py-10 md:py-12 bg-slate-50">
            <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-4 md:mb-8">
                    <h2 className="text-lg md:text-2xl xl:text-3xl font-extrabold text-[#253D4E] leading-tight">Membership</h2>
                    <Link
                        href="/membership"
                        className="shrink-0 px-3 py-2 md:px-5 md:py-3 md:min-h-[44px] xl:px-6 xl:py-3.5 flex items-center bg-[#005000] hover:bg-[#006600] text-white text-xs md:text-sm xl:text-base font-semibold transition-colors touch-manipulation rounded"
                    >
                        View Plans
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                    {plans.slice(0, 2).map((plan) => {
                        const features = (() => {
                            try {
                                return JSON.parse(plan.features || "[]") as string[];
                            } catch {
                                return [];
                            }
                        })().slice(0, 3);
                        const isPlus = plan.level === 2;

                        return (
                            <Link
                                key={plan.id}
                                href="/membership"
                                className="group block bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#005000]/30 transition-all duration-200 overflow-hidden"
                            >
                                <div className="p-4 md:p-6 flex flex-col">
                                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${isPlus ? "bg-amber-50 text-amber-600" : "bg-[#005000]/10 text-[#005000]"}`}>
                                            {isPlus ? <Crown className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} /> : <Zap className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#253D4E] text-base md:text-lg group-hover:text-[#005000] transition-colors">{plan.name}</h3>
                                            <p className="text-xs md:text-sm text-slate-500">
                                                AUD {plan.priceMonth}
                                                <span className="text-slate-400 font-medium">/month</span>
                                            </p>
                                        </div>
                                    </div>
                                    {plan.description && <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4 line-clamp-2">{plan.description}</p>}
                                    <ul className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
                                        {features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs md:text-sm text-slate-600">
                                                <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#005000] shrink-0" strokeWidth={2.5} />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <span className="mt-auto inline-block w-full py-2 md:py-2.5 text-center text-xs md:text-sm xl:text-base font-semibold text-[#005000] border-2 border-[#005000] rounded-lg group-hover:bg-[#005000] group-hover:text-white transition-colors">
                                        View details
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
