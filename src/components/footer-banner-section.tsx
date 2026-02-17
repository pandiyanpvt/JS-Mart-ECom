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

export default function FooterBannerSection() {
    const [banners, setBanners] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                // Dynamic import to avoid circular dependencies
                const { default: promotionService } = await import("@/services/promotion.service");
                const promotions = await promotionService.getByLevel(5);
                setBanners(promotions.sort((a, b) => a.order - b.order));
            } catch (error) {
                console.error("Failed to load footer banners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    if (loading) {
        return (
            <section className="w-full py-8 md:py-12 bg-gray-50">
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-[#005000]" />
                    </div>
                </div>
            </section>
        );
    }

    if (banners.length === 0) {
        return null;
    }

    // Footer banners: Full width single banner or grid layout for multiple
    if (banners.length === 1) {
        return (
            <section className="w-full py-8 md:py-12 bg-gray-50">
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                    <Link href="/shop" className="block group">
                        <div className="relative w-full h-[200px] md:h-[300px] lg:h-[350px] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                            <Image
                                src={banners[0].promotionImg}
                                alt="Promotional Banner"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1600px"
                            />
                        </div>
                    </Link>
                </div>
            </section>
        );
    }

    // Multiple banners: Grid layout
    let gridClass = "grid-cols-1";
    if (banners.length === 2) gridClass = "grid-cols-1 sm:grid-cols-2";
    if (banners.length === 3) gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (banners.length >= 4) gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

    return (
        <section className="w-full py-8 md:py-12 bg-gray-50">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                <div className={`grid ${gridClass} gap-4 md:gap-6`}>
                    {banners.map((banner) => (
                        <Link
                            key={banner.id}
                            href="/shop"
                            className="block group"
                        >
                            <div className="relative w-full h-[180px] md:h-[250px] lg:h-[300px] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <Image
                                    src={banner.promotionImg}
                                    alt="Promotional Banner"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
