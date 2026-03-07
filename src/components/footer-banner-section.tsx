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
            <section className="w-full py-8 md:py-12 bg-slate-50">
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

    // Single banner: no heading
    if (banners.length === 1) {
        return (
            <section className="w-full py-6 md:py-12 bg-slate-50">
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                    <Link
                        href={banners[0].redirectLink || "/shop"}
                        target={banners[0].redirectLink?.startsWith('http') ? "_blank" : undefined}
                        className="block group"
                    >
                        <div className="relative w-full h-[180px] sm:h-[200px] md:h-[300px] lg:h-[350px] overflow-hidden shadow-md border border-slate-100 hover:shadow-xl transition-all rounded-lg md:rounded-none">
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

    // Multiple banners: one image at a time, change every 5 sec (carousel, no heading)
    return (
        <FooterBannerCarousel banners={banners} />
    );
}

const ROTATE_INTERVAL_MS = 5000;

function FooterBannerCarousel({ banners }: { banners: Promotion[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, ROTATE_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [banners.length]);

    return (
        <section className="w-full py-6 md:py-12 bg-slate-50">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="relative w-full h-[180px] sm:h-[200px] md:h-[300px] lg:h-[350px] overflow-hidden shadow-md border border-slate-100 rounded-lg md:rounded-none">
                    {banners.map((banner, index) => (
                        <Link
                            key={banner.id}
                            href={banner.redirectLink || "/shop"}
                            target={banner.redirectLink?.startsWith('http') ? "_blank" : undefined}
                            className={`absolute inset-0 block transition-opacity duration-500 ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
                        >
                            <Image
                                src={banner.promotionImg}
                                alt="Promotional Banner"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1600px"
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
