"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import categoryService, { type Category as BackendCategory } from "@/services/category.service";
import { Loader2 } from "lucide-react";

const DEFAULT_CATEGORY_IMG = "/images/category-section/vegetables.png";

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
            <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12">
                <h2 className="text-4xl font-extrabold text-[#253D4E] mb-8">Featured Categories</h2>
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-10 h-10 animate-spin text-[#005000]" />
                </div>
            </section>
        );
    }

    if (categories.length === 0) {
        return null;
    }

    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-extrabold text-[#253D4E]">Featured Categories</h2>

                <Link
                    href="/shop"
                    className="shrink-0 px-5 py-2.5 rounded-lg bg-[#005000] hover:bg-[#006600] text-white text-sm font-semibold transition-colors"
                >
                    View More
                </Link>
            </div>

            {/* Scrollable Categories - from backend */}
            <div
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/shop?category=${category.id}`}
                        className="flex-shrink-0 group"
                    >
                        <div
                            className="w-[140px] h-[160px] rounded-2xl flex flex-col items-center justify-center p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-[#F2F3F4]"
                        >
                            <div className="relative w-20 h-20 mb-3 transform group-hover:scale-110 transition-transform duration-300">
                                <Image
                                    src={category.categoryImg || DEFAULT_CATEGORY_IMG}
                                    alt={category.category}
                                    fill
                                    className="object-contain drop-shadow-md"
                                />
                            </div>
                            <h3 className="text-[#253D4E] font-semibold text-sm text-center mb-1 leading-tight">
                                {category.category}
                            </h3>
                            <p className="text-[#7E7E7E] text-xs">
                                Shop now
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Custom CSS to hide scrollbar */}
            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </section>
    );
}
