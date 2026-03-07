"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, ChevronRight, Loader2 } from "lucide-react";
import { offerService } from "@/services/offer.service";

export default function FlashSaleBanner() {
    const [activeCount, setActiveCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const offers = await offerService.getAllOffers();
                const now = new Date();
                const active = offers.filter(
                    (o: any) =>
                        o.isActive &&
                        new Date(o.startDate) <= now &&
                        new Date(o.endDate) >= now
                );
                setActiveCount(active.length);
            } catch {
                setActiveCount(0);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return null;

    return (
        <Link
            href="/offers"
            className="block w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4 touch-manipulation"
        >
            <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-5 md:p-8 shadow-xl shadow-amber-200/50 active:shadow-amber-300/50 md:hover:shadow-amber-300/50 transition-shadow group rounded-lg md:rounded-none">
                <div className="absolute inset-0 opacity-10">
                    <Zap
                        className="absolute -left-10 -bottom-10 w-40 h-40 md:w-52 md:h-52 transform -rotate-12"
                        fill="currentColor"
                    />
                </div>
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                            <Zap size={28} className="text-white" fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90">
                                Limited Time
                            </p>
                            <h2 className="text-lg md:text-xl font-black uppercase tracking-wide">
                                Flash Offers
                            </h2>
                            <p className="text-sm opacity-90 mt-0.5">
                                {activeCount > 0
                                    ? `${activeCount} active deal${activeCount !== 1 ? "s" : ""} — Shop now`
                                    : "New deals added regularly"}
                            </p>
                        </div>
                    </div>
                    <span className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 bg-white text-rose-600 font-bold text-sm shadow-lg group-hover:bg-rose-50 active:bg-rose-100 transition-colors touch-manipulation rounded">
                        View Offers
                        <ChevronRight size={18} />
                    </span>
                </div>
            </div>
        </Link>
    );
}
