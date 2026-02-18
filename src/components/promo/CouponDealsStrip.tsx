"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket, Copy, ChevronRight, Loader2 } from "lucide-react";
import { offerService } from "@/services/offer.service";
import toast from "react-hot-toast";

interface CouponOffer {
    id: number;
    name?: string;
    couponCode?: string;
    discountPercentage?: number;
    discountAmount?: number;
    endDate?: string;
}

export default function CouponDealsStrip() {
    const [offers, setOffers] = useState<CouponOffer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const all = await offerService.getAllOffers();
                const now = new Date();
                const withCode = (all as any[])
                    .filter(
                        (o) =>
                            o.couponCode &&
                            o.isActive &&
                            new Date(o.endDate) >= now
                    )
                    .slice(0, 6);
                setOffers(withCode);
            } catch {
                setOffers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success(`Code ${code} copied!`);
    };

    if (loading) {
        return (
            <section className="w-full py-8 bg-white">
                <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            </section>
        );
    }

    if (offers.length === 0) return null;

    return (
        <section className="w-full py-10 md:py-12 bg-white">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                            At Checkout
                        </p>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900">
                            Coupon Codes
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Copy & use at checkout
                        </p>
                    </div>
                    <Link
                        href="/offers"
                        className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                        View All
                        <ChevronRight size={18} />
                    </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className="flex-shrink-0 w-[280px] md:w-[320px] border-2 border-slate-100 overflow-hidden bg-white shadow-sm hover:shadow-md hover:border-emerald-100 transition-all group"
                        >
                            <div className="p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                                    <Ticket size={96} className="transform rotate-12" />
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-wider opacity-90 mb-1">
                                    Coupon Code
                                </p>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xl md:text-2xl font-black font-mono tracking-widest">
                                        {offer.couponCode}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (offer.couponCode) copyCode(offer.couponCode);
                                        }}
                                        className="p-2 bg-white/20 hover:bg-white/30 transition-colors"
                                        title="Copy code"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                                <div className="mt-2 inline-flex items-center px-2.5 py-1 bg-white/20 text-xs font-bold backdrop-blur-sm">
                                    {offer.discountPercentage
                                        ? `${offer.discountPercentage}% OFF`
                                        : offer.discountAmount
                                        ? `AUD ${offer.discountAmount} OFF`
                                        : "OFFER"}
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-50">
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                    {offer.name || "Discount"}
                                </p>
                                {offer.endDate && (
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Valid till{" "}
                                        {new Date(offer.endDate).toLocaleDateString()}
                                    </p>
                                )}
                                <Link
                                    href="/shop"
                                    className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700"
                                >
                                    Shop Now
                                    <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
