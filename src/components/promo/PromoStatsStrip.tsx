"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, Ticket, Gift, ArrowRight } from "lucide-react";

interface PromoStatsStripProps {
    activeOffersCount?: number;
    dealsCount?: number;
    redemptionsLabel?: string;
}

export default function PromoStatsStrip({
    activeOffersCount = 0,
    dealsCount = 0,
    redemptionsLabel = "Save More",
}: PromoStatsStripProps) {
    const stats = [
        {
            label: "Today's Deals",
            value: dealsCount > 0 ? dealsCount : "—",
            sub: "Active offers",
            icon: TrendingUp,
            href: "/offers",
        },
        {
            label: "Active Coupons",
            value: activeOffersCount,
            sub: "Use at checkout",
            icon: Ticket,
            href: "/offers",
        },
        {
            label: "Redemptions",
            value: redemptionsLabel,
            sub: "Customers saving",
            icon: Gift,
            href: "/shop",
        },
    ];

    return (
        <section className="w-full py-5 md:py-6 bg-white border-b border-slate-100">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const isLast = index === stats.length - 1;
                        return (
                            <Link
                                key={stat.label}
                                href={stat.href}
                                className={`group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-xl md:rounded-2xl bg-slate-50/80 hover:bg-[#005000]/5 border border-slate-100 hover:border-[#005000]/20 transition-all duration-200 ${isLast ? "col-span-2 md:col-span-1" : ""}`}
                            >
                                <div className="w-11 h-11 rounded-xl bg-[#005000]/10 text-[#005000] flex items-center justify-center shrink-0 group-hover:bg-[#005000] group-hover:text-white transition-colors duration-200">
                                    <Icon size={22} strokeWidth={2} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-500">
                                        {stat.label}
                                    </p>
                                    <p className="text-lg md:text-xl font-bold text-[#253D4E] mt-0.5 truncate">
                                        {stat.value}
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#005000] group-hover:translate-x-0.5 transition-all shrink-0" />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
