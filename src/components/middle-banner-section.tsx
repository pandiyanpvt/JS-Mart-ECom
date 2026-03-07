"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

    // Duplicate for seamless infinite scroll (same pattern as Shop by Category banners)
    const duplicatedBanners = [...banners, ...banners];

    return (
        <section className="w-full py-6 sm:py-8 md:py-12 bg-slate-50 overflow-hidden">
            <div className="middle-banners-scroll-wrap w-full overflow-hidden">
                <div className="flex gap-4 md:gap-6 animate-middle-banners-scroll" style={{ width: "max-content" }}>
                    {duplicatedBanners.map((banner, index) => (
                        <Link
                            key={`${banner.id}-${index}`}
                            href="/shop"
                            className="flex-shrink-0 w-[300px] md:w-[360px] block relative overflow-hidden group rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#005000]/30 transition-all duration-300 aspect-[3/2] bg-white"
                        >
                            <Image
                                src={banner.promotionImg}
                                alt="Promotional Banner"
                                fill
                                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 300px, 360px"
                            />
                        </Link>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                @keyframes middleBannersScrollLeft {
                    0% {
                        transform: translateX(-50%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                .animate-middle-banners-scroll {
                    animation: middleBannersScrollLeft 50s linear infinite;
                }
                .middle-banners-scroll-wrap:hover .animate-middle-banners-scroll {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
