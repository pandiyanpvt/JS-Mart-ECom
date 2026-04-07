"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { resolveImageSrc } from "@/lib/images";

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
                <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
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
            <section className="w-full bg-white py-3 md:py-4">
                <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <Link
                        href={banners[0].redirectLink || "/shop"}
                        target={banners[0].redirectLink?.startsWith('http') ? "_blank" : undefined}
                        className="block group"
                    >
                        <div className="relative w-full aspect-[32/5] overflow-hidden rounded-xl md:rounded-2xl bg-slate-200">
                            <Image
                                src={resolveImageSrc(banners[0].promotionImg)}
                                alt="Promotional Banner"
                                fill
                                className="object-cover object-center"
                                sizes="100vw"
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

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    return (
        <section className="w-full bg-white py-3 md:py-4">
            <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="relative group w-full aspect-[32/5] overflow-hidden rounded-xl md:rounded-2xl bg-slate-200">
                    {banners.map((banner, index) => (
                        <Link
                            key={banner.id}
                            href={banner.redirectLink || "/shop"}
                            target={banner.redirectLink?.startsWith('http') ? "_blank" : undefined}
                            className={`absolute inset-0 block transition-opacity duration-500 ${
                                index === currentIndex
                                    ? "opacity-100 z-10 animate__animated animate__slideInLeft"
                                    : "opacity-0 z-0 pointer-events-none"
                            }`}
                        >
                            <Image
                                src={resolveImageSrc(banner.promotionImg)}
                                alt="Promotional Banner"
                                fill
                                className="object-cover object-center"
                                sizes="100vw"
                            />
                        </Link>
                    ))}
                    <button
                        type="button"
                        onClick={prevSlide}
                        className="absolute left-1.5 top-1/2 z-20 flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50 md:left-2 md:opacity-0 md:group-hover:opacity-100"
                        aria-label="Previous banner"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={nextSlide}
                        className="absolute right-1.5 top-1/2 z-20 flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50 md:right-2 md:opacity-0 md:group-hover:opacity-100"
                        aria-label="Next banner"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}
