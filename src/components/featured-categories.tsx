"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Category = {
    id: number;
    name: string;
    image: string;
    itemCount: number;
    bgColor: string;
};

const categories: Category[] = [
    { id: 1, name: "Fresh Fruits", image: "/images/category-section/fruits.png", itemCount: 45, bgColor: "#FFF3E0" },
    { id: 2, name: "Fresh Vegetables", image: "/images/category-section/vegetables.png", itemCount: 38, bgColor: "#E8F5E9" },
    { id: 3, name: "Dairy & Eggs", image: "/images/category-section/dairy.png", itemCount: 28, bgColor: "#FFF8E1" },
    { id: 4, name: "Meat & Seafood", image: "/images/category-section/meat.png", itemCount: 32, bgColor: "#FFEBEE" },
    { id: 5, name: "Bakery & Bread", image: "/images/category-section/bakery.png", itemCount: 24, bgColor: "#FFF9C4" },
    { id: 6, name: "Beverages", image: "/images/category-section/beverages.png", itemCount: 52, bgColor: "#E3F2FD" },
    { id: 7, name: "Snacks & Chips", image: "/images/category-section/snacks.png", itemCount: 41, bgColor: "#FCE4EC" },
    { id: 8, name: "Frozen Foods", image: "/images/category-section/frozen.png", itemCount: 29, bgColor: "#E0F2F1" },
    { id: 9, name: "Pantry Staples", image: "/images/category-section/pantry.png", itemCount: 67, bgColor: "#F3E5F5" },
    { id: 10, name: "Personal Care", image: "/images/category-section/personal_care.png", itemCount: 35, bgColor: "#FFF3E0" },
    { id: 11, name: "Electronic Items", image: "/images/category-section/electronics.png", itemCount: 22, bgColor: "#E3F2FD" },
];



export default function FeaturedCategories() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollLeft =
                scrollContainerRef.current.scrollLeft +
                (direction === "left" ? -scrollAmount : scrollAmount);

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12">
            {/* Header */}
            <div className="relative flex items-center justify-center mb-8">
                <h2 className="text-3xl font-bold text-[#253D4E]">Featured Categories</h2>

                {/* Navigation Arrows */}
                <div className="absolute right-0 flex items-center gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-[#3BB77E] transition-all shadow-sm"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-[#3BB77E] transition-all shadow-sm"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Scrollable Categories */}
            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/products?category=${category.id}`}
                        className="flex-shrink-0 group"
                    >
                        <div
                            className="w-[140px] h-[160px] rounded-2xl flex flex-col items-center justify-center p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                            style={{ backgroundColor: category.bgColor }}
                        >
                            <div className="relative w-20 h-20 mb-3 transform group-hover:scale-110 transition-transform duration-300">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-contain drop-shadow-md mix-blend-multiply"
                                />
                            </div>
                            <h3 className="text-[#253D4E] font-semibold text-sm text-center mb-1 leading-tight">
                                {category.name}
                            </h3>
                            <p className="text-[#7E7E7E] text-xs">
                                {category.itemCount} items
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
