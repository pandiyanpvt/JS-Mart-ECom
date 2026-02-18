"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import categoryService, { type Category as BackendCategory } from "@/services/category.service";
import { Loader2 } from "lucide-react";

const DEFAULT_CATEGORY_IMG = "/images/category-section/vegetables.png";
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
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                    <h2 className="text-2xl font-extrabold text-[#253D4E] mb-8">Featured Categories</h2>
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
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-4 md:mb-8">
                    <h2 className="text-lg md:text-2xl font-extrabold text-[#253D4E] leading-tight">Featured Categories</h2>
                    <Link
                        href="/shop"
                        className="shrink-0 px-3 py-2 md:px-5 md:py-3 md:min-h-[44px] flex items-center bg-[#005000] hover:bg-[#006600] text-white text-xs md:text-sm font-semibold transition-colors touch-manipulation rounded"
                    >
                        View More
                    </Link>
                </div>

                {/* Categories - Grid on desktop, scrollable on mobile (max 12) */}
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
                    {displayCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/shop?category=${category.id}`}
                            className="flex flex-col items-center gap-3 group transition-opacity hover:opacity-90"
                        >
                            <div className="relative w-24 h-24 lg:w-28 lg:h-28 transform group-hover:scale-105 transition-transform duration-300">
                                <Image
                                    src={category.categoryImg || DEFAULT_CATEGORY_IMG}
                                    alt={category.category}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 1024px) 96px, 112px"
                                />
                            </div>
                            <h3 className="text-[#253D4E] font-semibold text-sm text-center leading-tight">
                                {category.category}
                            </h3>
                        </Link>
                    ))}
                </div>

                {/* Mobile: Horizontal Scroll - smaller tiles */}
                <div
                    className="flex md:hidden gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 pt-1"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {displayCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/shop?category=${category.id}`}
                            className="flex-shrink-0 flex flex-col items-center gap-2 group transition-opacity hover:opacity-90 w-[76px]"
                        >
                            <div className="relative w-14 h-14 transform group-hover:scale-105 transition-transform duration-300">
                                <Image
                                    src={category.categoryImg || DEFAULT_CATEGORY_IMG}
                                    alt={category.category}
                                    fill
                                    className="object-contain"
                                    sizes="56px"
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
