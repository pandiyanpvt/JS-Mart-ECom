"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import categoryService, { type Category } from "@/services/category.service";
import { Loader2 } from "lucide-react";

const DEFAULT_BANNER = "/images/placeholder.png";

function CategoryBannerCard({ cat }: { cat: Category }) {
    const imgSrc = cat.bannerImg || cat.categoryImg || DEFAULT_BANNER;
    return (
        <Link
            href={`/shop?category=${cat.id}`}
            className="flex-shrink-0 w-[300px] md:w-[360px] block relative overflow-hidden group rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#005000]/30 transition-all duration-300 aspect-[3/2] bg-white"
        >
            <Image
                src={imgSrc}
                alt={cat.category}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 300px, 360px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white font-bold text-sm md:text-base">
                {cat.category}
            </span>
        </Link>
    );
}

export default function CategoryBannersSection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        categoryService
            .getActive()
            .then((data) => setCategories(data.filter((c) => c.level === 1)))
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="w-full py-10 md:py-12 bg-slate-50">
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-10 h-10 animate-spin text-[#005000]" />
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    // Duplicate for seamless infinite scroll
    const duplicatedCategories = [...categories, ...categories];

    return (
        <section className="w-full py-6 sm:py-8 md:py-12 bg-slate-50 overflow-hidden">
            {/* Cargills-style: continuous left-to-right scrolling strip (content moves left) */}
            <div className="category-banners-scroll-wrap w-full overflow-hidden">
                <div className="flex gap-4 md:gap-6 animate-category-scroll" style={{ width: "max-content" }}>
                    {duplicatedCategories.map((cat, index) => (
                        <CategoryBannerCard key={`${cat.id}-${index}`} cat={cat} />
                    ))}
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <style jsx global>{`
                @keyframes categoryScrollLeft {
                    0% {
                        transform: translateX(-50%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                .animate-category-scroll {
                    animation: categoryScrollLeft 50s linear infinite;
                }
                .category-banners-scroll-wrap:hover .animate-category-scroll {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
