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
        <section className="w-full py-16 md:py-20 bg-white">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                <div className={`grid ${gridClass} gap-6 md:gap-8`}>
                    {banners.map((banner) => (
                        <div
                            key={banner.id}
                            className="relative w-full overflow-hidden rounded-2xl group aspect-[4/5] shadow-sm hover:shadow-md transition-shadow"
                        >
                            <Image
                                src={banner.promotionImg}
                                alt="Promotional Banner"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/* Optional: Add overlay/link if needed */}
                            <Link href="/shop" className="absolute inset-0 z-10">
                                <span className="sr-only">View Offer</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
