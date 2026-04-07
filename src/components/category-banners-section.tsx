"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import categoryService, { type Category } from "@/services/category.service";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { resolveImageSrc } from "@/lib/images";

function CategoryBannerCard({ cat }: { cat: Category }) {
    const imgSrc = resolveImageSrc(cat.bannerImg || cat.categoryImg);
    return (
        <Link
            href={`/shop?category=${cat.id}`}
            className="block relative overflow-hidden group rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#005000]/30 transition-all duration-300 aspect-[3/2] bg-white"
        >
            <Image
                src={imgSrc}
                alt={cat.category}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 300px, 360px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute bottom-0 left-0 right-0 p-3 md:p-4 xl:p-5 text-white font-bold text-sm md:text-base xl:text-lg 2xl:text-xl">
                {cat.category}
            </span>
        </Link>
    );
}

export default function CategoryBannersSection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        categoryService
            .getActive()
            .then((data) => setCategories(data.filter((c) => c.level === 1)))
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
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

    const maxStartIndex = Math.max(0, categories.length - visibleCount);
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1));
    };
    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxStartIndex : prev - 1));
    };

    useEffect(() => {
        setCurrentIndex((prev) => Math.min(prev, maxStartIndex));
    }, [maxStartIndex]);

    useEffect(() => {
        if (categories.length <= visibleCount) return;
        const timer = setInterval(nextSlide, 3000);
        return () => clearInterval(timer);
    }, [categories.length, visibleCount, maxStartIndex]);

    if (loading) {
        return (
            <section className="w-full py-10 md:py-12 bg-slate-50">
                <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-10 h-10 animate-spin text-[#005000]" />
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="w-full py-6 sm:py-8 md:py-12 bg-slate-50 overflow-hidden">
            <div className="relative">
                <button
                    type="button"
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 z-20 hidden min-h-[38px] min-w-[38px] -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50 md:flex"
                    aria-label="Previous category banners"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 z-20 hidden min-h-[38px] min-w-[38px] -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50 md:flex"
                    aria-label="Next category banners"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            <div className="w-full overflow-hidden">
                <div
                    className="flex gap-4 md:gap-6 transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
                >
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex-shrink-0"
                            style={{ width: `calc(${100 / visibleCount}% - ${(visibleCount - 1) * 1.5 / visibleCount}rem)` }}
                        >
                            <CategoryBannerCard cat={cat} />
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </section>
    );
}
