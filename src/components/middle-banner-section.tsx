"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface Promotion {
    id: number;
    level: number;
    order: number;
    promotionImg: string;
    isActive: boolean;
    redirectLink?: string;
}

export default function MiddleBannerSection() {
    const [banners, setBanners] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                // Dynamic import to avoid circular dependencies
                const { default: promotionService } = await import("@/services/promotion.service");
                const promotions = await promotionService.getByLevel(3);
                setBanners(promotions.sort((a, b) => a.order - b.order));
            } catch (error) {
                console.error("Failed to load middle banners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    if (loading) return null;
    if (banners.length === 0) return null;

    // Determine grid columns based on number of banners (responsive)
    let gridClass = "grid-cols-1";
    if (banners.length === 2) gridClass = "grid-cols-1 sm:grid-cols-2";
    if (banners.length === 3) gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (banners.length === 4) gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    if (banners.length >= 5) gridClass = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";

    return (
        <section className="w-full py-10 md:py-12 bg-emerald-50">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#253D4E] leading-tight">Curated picks and seasonal offers</h2>
                </div>
                {/* Mobile: horizontal scroll card banners */}
                <div
                    className="flex md:hidden gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2 -mx-4 px-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {banners.map((banner) => (
                        <Link
                            key={banner.id}
                            href={banner.redirectLink || "/shop"}
                            target={banner.redirectLink?.startsWith('http') ? "_blank" : undefined}
                            className="flex-shrink-0 w-[58vw] max-w-[220px] block relative overflow-hidden group aspect-[4/5] shadow-md border border-slate-100 active:shadow-xl transition-all rounded-lg"
                        >
                            <Image
                                src={banner.promotionImg}
                                alt="Promotional Banner"
                                fill
                                className="object-cover transition-transform duration-300 group-active:scale-[1.02]"
                                sizes="(max-width: 768px) 72vw, 320px"
                            />
                        </Link>
                    ))}
                </div>
                {/* Desktop: grid */}
                <div className={`hidden md:grid ${gridClass} gap-6 md:gap-8`}>
                    {banners.map((banner) => (
                        <div
                            key={banner.id}
                            className="relative w-full overflow-hidden group aspect-[4/5] shadow-md border border-slate-100 hover:shadow-xl transition-all rounded-lg"
                        >
                            <Image
                                src={banner.promotionImg}
                                alt="Promotional Banner"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <Link
                                href={banner.redirectLink || "/shop"}
                                target={banner.redirectLink?.startsWith('http') ? "_blank" : undefined}
                                className="absolute inset-0 z-10"
                            >
                                <span className="sr-only">View Offer</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
