"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { offerService } from "@/services/offer.service";
import { Offer, getOfferImageUrl } from "@/utils/offerUtils";

export default function OfferCardSection() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const allOffers = await offerService.getAllOffers();
                // Filter for active offers, limit to most recent/relevant
                const activeOffers = allOffers.filter((offer: any) => {
                    if (!offer.isActive) return false;
                    const now = new Date();
                    const start = new Date(offer.startDate);
                    const end = offer.endDate ? new Date(offer.endDate) : null;
                    const hasStarted = isNaN(start.getTime()) || start <= now;
                    const havenNotEnded = !end || isNaN(end.getTime()) || end >= now;
                    return hasStarted && havenNotEnded;
                }).slice(0, 4);
                setOffers(activeOffers);
            } catch (error) {
                console.error("Failed to load offers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    if (loading || offers.length === 0) return null;

    return (
        <section className="w-full py-10 md:py-12 bg-white">
            <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-4 md:mb-8">
                    <h2 className="text-lg md:text-2xl xl:text-3xl font-extrabold text-[#253D4E] leading-tight">Best Deals</h2>
                    <Link
                        href="/offers"
                        className="shrink-0 px-3 py-2 md:px-5 md:py-3 md:min-h-[44px] xl:px-6 xl:py-3.5 flex items-center text-[#005000] hover:text-[#006600] text-xs md:text-sm xl:text-base font-bold transition-colors touch-manipulation rounded whitespace-nowrap"
                    >
                        View More
                    </Link>
                </div>
                {/* Mobile: horizontal scroll - smaller cards */}
                <div
                    className="flex md:hidden gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2 -mx-4 px-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {offers.map((offer) => {
                        const imgUrl = getOfferImageUrl(offer);
                        return (
                            <Link
                                key={offer.id}
                                href={offer.productId ? `/shop/${offer.productId}` : "/shop"}
                                className="flex-shrink-0 w-[72vw] min-w-[220px] max-w-[280px] snap-start block bg-white overflow-hidden rounded-lg border border-slate-200 shadow-sm active:shadow-md active:scale-[0.98] transition-all"
                            >
                                <div className="border-t-4 border-[#005000] relative h-24 w-full bg-slate-50 overflow-hidden">
                                    <Image src={imgUrl} alt={offer.name || "Offer"} fill className="object-cover" sizes="(max-width: 768px) 56vw, 200px" />
                                    <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-[#005000] text-white text-[9px] font-bold rounded">
                                        {offer.discountPercentage ? `−${offer.discountPercentage}%` : "DEAL"}
                                    </span>
                                </div>
                                <div className="p-2">
                                    <h3 className="font-semibold text-[#253D4E] text-[11px] line-clamp-1">{offer.name}</h3>
                                    {offer.couponCode && (
                                        <div className="mt-1 py-0.5 px-1.5 bg-[#005000]/5 border border-dashed border-[#005000]/25 rounded text-center">
                                            <span className="font-mono text-[10px] font-bold text-[#005000]">{offer.couponCode}</span>
                                        </div>
                                    )}
                                    <span className="mt-1.5 inline-block w-full py-1.5 text-center text-[10px] font-semibold text-[#005000] border border-[#005000] rounded">
                                        Shop Now
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                {/* Desktop: grid with image */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {offers.map((offer) => {
                        const imgUrl = getOfferImageUrl(offer);
                        return (
                            <Link
                                key={offer.id}
                                href={offer.productId ? `/shop/${offer.productId}` : "/shop"}
                                className="group bg-white flex flex-col h-full rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#005000]/30 transition-all duration-200 overflow-hidden"
                            >
                                <div className="border-t-4 border-[#005000] relative h-40 w-full bg-slate-50 overflow-hidden">
                                    <Image src={imgUrl} alt={offer.name || "Offer"} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 1024px) 50vw, 25vw" />
                                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-[#005000] text-white text-[10px] font-bold rounded">
                                        {offer.discountPercentage ? `−${offer.discountPercentage}%` : "DEAL"}
                                    </span>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-semibold text-[#253D4E] text-base line-clamp-1 group-hover:text-[#005000] transition-colors">{offer.name}</h3>
                                    {offer.description && <p className="text-sm text-slate-500 line-clamp-2 mt-1">{offer.description}</p>}
                                    {offer.couponCode && (
                                        <div className="mt-4 py-2 px-3 bg-[#005000]/5 border border-dashed border-[#005000]/25 rounded-lg text-center">
                                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Use at checkout</span>
                                            <span className="block font-mono text-sm font-bold text-[#005000] tracking-widest mt-0.5">{offer.couponCode}</span>
                                        </div>
                                    )}
                                    <span className="mt-4 inline-block w-full py-2.5 text-center text-sm font-semibold text-[#005000] border-2 border-[#005000] rounded-lg group-hover:bg-[#005000] group-hover:text-white transition-colors">
                                        Shop Now
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
