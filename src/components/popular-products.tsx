"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Heart, Eye, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/lib/data";

type LocalProduct = {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    rating: number;
    discount?: number;
    isNew?: boolean;
    unit: string;
    reviewCount?: number;
};

const products: LocalProduct[] = [
    {
        id: 1,
        name: "Fresh Apple",
        image: "/images/products/apple.png",
        price: 250.00,
        originalPrice: 350.00,
        rating: 5,
        discount: 29,
        unit: "5kg",
        reviewCount: 75
    },
    {
        id: 2,
        name: "Fresh Litchi 100% Organic",
        image: "/images/products/litchi.png",
        price: 75.00,
        originalPrice: 80.00,
        rating: 5,
        discount: 17,
        unit: "1kg",
        reviewCount: 42
    },
    {
        id: 3,
        name: "Vegetable Tomato Fresh",
        image: "/images/products/tomato.png",
        price: 150.00,
        originalPrice: 170.00,
        rating: 4,
        discount: 7,
        unit: "1kg",
        reviewCount: 38
    },
    {
        id: 4,
        name: "Natural Cabbage",
        image: "/images/products/cabbage.png",
        price: 50.00,
        originalPrice: 80.00,
        rating: 5,
        discount: 34,
        unit: "1pc",
        reviewCount: 91
    },
    {
        id: 5,
        name: "Fresh Dried Almond",
        image: "/images/products/almond.png",
        price: 200.00,
        rating: 4,
        isNew: true,
        unit: "50g",
        reviewCount: 28
    },
    {
        id: 6,
        name: "Fresh Apple",
        image: "/images/products/apple.png",
        price: 250.00,
        originalPrice: 350.00,
        rating: 5,
        discount: 29,
        unit: "5kg",
        reviewCount: 75
    },
];

export default function PopularProducts() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

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
                        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                            }`}
                    />
                ))}
            </div>
        );
    };

    const handleWishlistToggle = (product: LocalProduct) => {
        const wishlistProduct: Product = {
            id: String(product.id),
            name: product.name,
            category: "fruits", // Default category, adjust as needed
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            description: product.name,
            weight: product.unit,
            rating: product.rating,
            reviews: product.reviewCount || 0,
        };

        if (isInWishlist(wishlistProduct.id)) {
            removeFromWishlist(wishlistProduct.id);
        } else {
            addToWishlist(wishlistProduct);
        }
    };

    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-extrabold text-[#253D4E]">Popular Products</h2>

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
                    <div
                        key={product.id}
                        className="flex-shrink-0 group min-w-[270px]"
                    >
                        <div className="bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
                            {/* Top Section with Image and Icons */}
                            <div className="relative bg-gray-50 p-4">
                                {/* Discount Badge */}
                                {product.discount && (
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="bg-[#FF4858] text-white text-xs font-bold px-2.5 py-1 rounded">
                                            -{product.discount}%
                                        </span>
                                    </div>
                                )}

                                {/* New Badge */}
                                {product.isNew && (
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="bg-[#3BB77E] text-white text-xs font-bold px-2.5 py-1 rounded">
                                            NEW
                                        </span>
                                    </div>
                                )}

                                {/* Action Icons */}
                                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleWishlistToggle(product as any);
                                        }}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all group/icon ${isInWishlist(String(product.id))
                                            ? "bg-[#3BB77E] text-white"
                                            : "bg-white hover:bg-[#3BB77E] hover:text-white"
                                            }`}
                                        title={isInWishlist(String(product.id)) ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        <Heart className={`w-4 h-4 ${isInWishlist(String(product.id))
                                            ? "fill-white text-white"
                                            : "text-gray-700 group-hover/icon:text-white"
                                            }`} />
                                    </button>
                                    <Link href={`/shop/${product.id}`}>
                                        <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#3BB77E] hover:text-white transition-all group/icon">
                                            <Eye className="w-4 h-4 text-gray-700 group-hover/icon:text-white" />
                                        </button>
                                    </Link>
                                </div>

                                {/* Product Image */}
                                <div className="relative w-full h-[180px] flex items-center justify-center">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Add to Cart Button */}
                                <button className="w-full bg-[#0F1111] text-white py-3 rounded font-medium hover:bg-[#232F3E] transition-all flex items-center justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                                    <ShoppingCart className="w-4 h-4" />
                                    Add To Cart
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="p-4 space-y-2">
                                <Link href={`/shop/${product.id}`}>
                                    <h3 className="text-[#253D4E] font-semibold text-sm leading-tight hover:text-[#3BB77E] transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>

                                {/* Price */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[#FF4858] font-bold text-xl">
                                        ${product.price.toFixed(0)}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-gray-400 text-sm line-through font-medium">
                                            ${product.originalPrice.toFixed(0)}
                                        </span>
                                    )}
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2">
                                    {renderStars(product.rating)}
                                    <span className="text-gray-500 text-sm">({product.reviewCount || 0})</span>
                                </div>
                            </div>
                        </div>
                    </div>
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
