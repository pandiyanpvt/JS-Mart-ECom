"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

type Product = {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    rating: number;
    discount?: number;
    isNew?: boolean;
    unit: string;
};

const products: Product[] = [
    {
        id: 1,
        name: "Fresh Apple",
        image: "/images/products/apple.png",
        price: 250.00,
        originalPrice: 350.00,
        rating: 5,
        discount: 29,
        unit: "5kg"
    },
    {
        id: 2,
        name: "Fresh Litchi 100% Organic",
        image: "/images/products/litchi.png",
        price: 75.00,
        originalPrice: 80.00,
        rating: 5,
        discount: 17,
        unit: "1kg"
    },
    {
        id: 3,
        name: "Vegetable Tomato Fresh",
        image: "/images/products/tomato.png",
        price: 150.00,
        originalPrice: 170.00,
        rating: 4,
        discount: 7,
        unit: "1kg"
    },
    {
        id: 4,
        name: "Natural Cabbage",
        image: "/images/products/cabbage.png",
        price: 50.00,
        originalPrice: 80.00,
        rating: 5,
        discount: 34,
        unit: "1pc"
    },
    {
        id: 5,
        name: "Fresh Dried Almond",
        image: "/images/products/almond.png",
        price: 200.00,
        rating: 4,
        isNew: true,
        unit: "50g"
    },
    {
        id: 6,
        name: "Fresh Apple",
        image: "/images/products/apple.png",
        price: 250.00,
        originalPrice: 350.00,
        rating: 5,
        discount: 29,
        unit: "5kg"
    },
];

export default function PopularProducts() {
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

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3 h-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-[#253D4E]">Popular Products</h2>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="w-8 h-8 rounded bg-[#3BB77E] flex items-center justify-center hover:bg-[#299E63] transition-all shadow-sm group"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="w-8 h-8 rounded bg-[#3BB77E] flex items-center justify-center hover:bg-[#299E63] transition-all shadow-sm group"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Scrollable Products */}
            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="flex-shrink-0 group min-w-[220px]"
                    >
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 transition-all duration-300 hover:shadow-lg hover:border-[#3BB77E]/30 relative overflow-hidden h-full">
                            {/* Badges */}
                            <div className="absolute top-0 left-0 w-full flex justify-between p-3 z-10">
                                {product.isNew && (
                                    <span className="bg-[#3BB77E] text-white text-[10px] font-bold px-2 py-1 rounded-tl-lg rounded-br-lg">
                                        New
                                    </span>
                                )}
                                {!product.isNew && <span />} {/* Spacer */}

                                {product.discount && (
                                    <span className="bg-[#F74B81] text-white text-[10px] font-bold px-2 py-1 rounded-tl-lg rounded-br-lg">
                                        -{product.discount}%
                                    </span>
                                )}
                            </div>

                            {/* Image */}
                            <div className="relative w-full h-[160px] mb-4 flex items-center justify-center">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <h3 className="text-[#253D4E] font-bold text-sm leading-tight group-hover:text-[#3BB77E] transition-colors">
                                    {product.name} <span className="text-gray-400 font-normal">({product.unit})</span>
                                </h3>

                                {renderStars(product.rating)}

                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[#3BB77E] font-bold text-lg">
                                        Rs. {product.price.toFixed(2)}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-gray-400 text-xs line-through font-medium">
                                            Rs. {product.originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>
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
