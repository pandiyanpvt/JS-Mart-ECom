"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveImageSrc } from "@/lib/images";

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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(4);
    const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
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

    useEffect(() => {
        const updateVisibleCount = () => {
            const w = window.innerWidth;
            if (w >= 1024) setVisibleCount(4);
            else if (w >= 768) setVisibleCount(3);
            else if (w >= 640) setVisibleCount(2);
            else setVisibleCount(1);
        };
        updateVisibleCount();
        window.addEventListener("resize", updateVisibleCount);
        return () => window.removeEventListener("resize", updateVisibleCount);
    }, []);

    const maxStartIndex = Math.max(0, banners.length - visibleCount);

    useEffect(() => {
        setCurrentIndex((prev) => Math.min(prev, maxStartIndex));
    }, [maxStartIndex]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxStartIndex : prev - 1));
    };

    useEffect(() => {
        if (banners.length <= visibleCount) return;
        autoplayRef.current = setInterval(nextSlide, 3000);
        return () => {
            if (autoplayRef.current) clearInterval(autoplayRef.current);
        };
    }, [banners.length, visibleCount, maxStartIndex]);

    if (loading) return null;
    if (banners.length === 0) return null;

    return (
        <section className="w-full py-3 md:py-5 bg-white">
            <div className="relative px-4 sm:px-5 md:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 z-20 hidden min-h-[38px] min-w-[38px] -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50 md:left-4 md:flex"
                    aria-label="Previous banners"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 z-20 hidden min-h-[38px] min-w-[38px] -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50 md:right-4 md:flex"
                    aria-label="Next banners"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
                <div className="middle-banners-carousel w-full overflow-hidden py-1">
                    <div
                        className="flex gap-4 transition-transform duration-700 ease-in-out md:gap-5"
                        style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
                    >
                        {banners.map((banner, index) => (
                        <Link
                            key={`${banner.id}-${index}`}
                            href={banner.redirectLink || "/shop"}
                            target={banner.redirectLink?.startsWith('http') ? "_blank" : undefined}
                            className="block relative overflow-hidden group rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:border-[#005000]/30 hover:shadow-lg md:rounded-2xl aspect-[12/5] min-h-[92px] sm:min-h-[96px] md:min-h-[104px] bg-white flex-shrink-0"
                            style={{ width: `calc((100% - ${(visibleCount - 1) * 1.25}rem) / ${visibleCount})` }}
                        >
                            <Image
                                src={resolveImageSrc(banner.promotionImg)}
                                alt="Curated pick banner"
                                fill
                                className="object-cover object-center"
                                sizes="(max-width: 640px) 260px, (max-width: 768px) 320px, 360px"
                            />
                        </Link>
                    ))}
                </div>
                </div>
            </div>
        </section>
    );
}
