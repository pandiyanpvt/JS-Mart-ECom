"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { offerService } from "@/services/offer.service";
import { Offer } from "@/utils/offerUtils";

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
        <section className="w-full py-16 md:py-20 bg-gray-50">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <h2 className="text-3xl font-extrabold text-[#253D4E]">Best Deals</h2>
                    <Link href="/offers" className="px-5 py-2.5 rounded-lg bg-[#005000] hover:bg-[#006600] text-white text-sm font-semibold transition-colors whitespace-nowrap">
                        View All Offers
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {offers.map((offer) => (
                        <div key={offer.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full group">
                            {/* Offer Image/Product Image */}
                            <div className="relative h-48 w-full bg-gray-50">
                                <Image
                                    src={offer.product?.productImages?.[0]?.image || "/placeholder.png"}
                                    alt={offer.name || "Offer"}
                                    fill
                                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    {offer.discountPercentage ? `-${offer.discountPercentage}%` : "OFFER"}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 md:p-6 flex flex-col flex-1">
                                <h3 className="font-bold text-[#253D4E] text-base md:text-lg mb-1 line-clamp-1">{offer.name}</h3>
                                <p className="text-xs md:text-sm text-gray-500 mb-3 line-clamp-2">{offer.description}</p>

                                <div className="mt-auto">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-3">
                                        <span className="text-lg md:text-xl font-bold text-[#005000]">
                                            {offer.couponCode ? "Use Code:" : "Special Price"}
                                        </span>
                                        {offer.couponCode && (
                                            <span className="text-sm md:text-lg font-mono bg-green-50 text-[#005000] px-2 py-0.5 rounded border border-green-200 inline-block">
                                                {offer.couponCode}
                                            </span>
                                        )}
                                    </div>
                                    <Link href={offer.productId ? `/shop/${offer.productId}` : "/shop"}>
                                        <button className="w-full py-2 md:py-2.5 rounded-lg border border-[#005000] text-[#005000] font-semibold hover:bg-[#005000] hover:text-white transition-colors text-sm md:text-base">
                                            Shop Now
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
