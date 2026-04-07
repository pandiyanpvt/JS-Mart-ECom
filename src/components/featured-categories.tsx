"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import categoryService, { type Category as BackendCategory } from "@/services/category.service";
import { Loader2 } from "lucide-react";
import { resolveImageSrc } from "@/lib/images";
const FEATURED_LIMIT = 12;

export default function FeaturedCategories() {
    const [categories, setCategories] = useState<BackendCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        categoryService
            .getActive()
            .then(setCategories)
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="w-full py-10 md:py-12 bg-white">
                <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl md:text-2xl xl:text-3xl font-extrabold text-[#253D4E] mb-8">Shop by Category</h2>
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-10 h-10 animate-spin text-[#005000]" />
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) {
        return null;
    }

    const displayCategories = categories.slice(0, FEATURED_LIMIT);

    return (
        <section className="w-full py-10 md:py-12 bg-white">
            <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-4 md:mb-8">
                    <h2 className="text-lg md:text-2xl xl:text-3xl 2xl:text-[2rem] font-extrabold text-[#253D4E] leading-tight">Shop by Category</h2>
                    <Link
                        href="/shop"
                        className="shrink-0 px-3 py-2 md:px-5 md:py-3 md:min-h-[44px] xl:px-6 xl:py-3.5 flex items-center text-[#005000] hover:text-[#006600] text-xs md:text-sm xl:text-base font-bold transition-colors touch-manipulation rounded whitespace-nowrap"
                    >
                        View More
                    </Link>
                </div>

                {/* Categories - Grid on desktop, scrollable on mobile (max 12) */}
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-5 md:gap-6 xl:gap-5 2xl:gap-6 justify-items-center">
                    {displayCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/shop?category=${category.id}`}
                            className="flex flex-col items-center gap-3 xl:gap-3.5 w-full max-w-[140px] xl:max-w-[160px] 2xl:max-w-[180px] group transition-opacity hover:opacity-90"
                        >
                            <div className="relative w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36 transform group-hover:scale-105 transition-transform duration-300 rounded-full border border-slate-200 bg-white p-3 lg:p-3.5 xl:p-4 2xl:p-4.5 shadow-sm">
                                <Image
                                    src={resolveImageSrc(category.categoryImg)}
                                    alt={category.category}
                                    fill
                                    className="object-contain p-3 lg:p-4"
                                    sizes="(max-width: 1024px) 96px, (max-width: 1280px) 112px, (max-width: 1536px) 128px, 144px"
                                />
                            </div>
                            <h3 className="text-[#253D4E] font-semibold text-sm xl:text-base 2xl:text-lg text-center leading-tight px-0.5">
                                {category.category}
                            </h3>
                        </Link>
                    ))}
                </div>

                {/* Mobile: horizontal scroll edge-to-edge, same as other sections */}
                <div
                    className="flex md:hidden gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2 pt-1 -mx-4 px-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {displayCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/shop?category=${category.id}`}
                            className="flex-shrink-0 flex flex-col items-center gap-2 group transition-opacity hover:opacity-90 w-[92px]"
                        >
                            <div className="relative w-16 h-16 rounded-full border border-slate-200 bg-white p-2 shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                                <Image
                                    src={resolveImageSrc(category.categoryImg)}
                                    alt={category.category}
                                    fill
                                    className="object-contain p-2"
                                    sizes="64px"
                                />
                            </div>
                            <h3 className="text-[#253D4E] font-semibold text-[11px] text-center leading-tight">
                                {category.category}
                            </h3>
                        </Link>
                    ))}
                </div>

                {/* Custom CSS to hide scrollbar */}
                <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
            </div>
        </section>
    );
}
