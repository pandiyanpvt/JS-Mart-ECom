"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Tag, Percent } from "lucide-react";
import Image from "next/image";

export default function OffersPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter products that have a discount (originalPrice > price) or an "OFF"/ "Sale" badge
  const offerProducts = useMemo(() => {
    return products.filter(product =>
      (product.originalPrice && product.originalPrice > product.price) ||
      product.badges?.some(badge => badge.includes("OFF") || badge.includes("Sale"))
    );
  }, []);

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
    <main className="flex flex-col items-center w-full pb-16 bg-white">
      {/* Hero Section */}
      <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <div className="relative overflow-hidden min-h-[250px] md:min-h-[350px] flex items-center justify-center shadow-lg rounded-[2rem]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/headers/offers-header.png"
              alt="Special Offers"
              fill
              className="object-cover"
              priority
            />

          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl z-[1]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl z-[1]" />

          {/* Content */}
          <div className="relative z-10 text-center px-4 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-lg mb-4">
              Special Offers
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Discover amazing deals on your favorite products. Save big today!
            </p>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-extrabold text-[#253D4E]">Featured Deals</h2>
            <p className="text-gray-500 text-sm mt-2">Don't miss out on these incredible savings</p>
          </div>

          {/* Navigation Arrows */}
          {offerProducts.length > 0 && (
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
          )}
        </div>

        {/* Scrollable Products */}
        {offerProducts.length > 0 ? (
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {offerProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[270px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Tag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No active offers right now</h3>
            <p className="text-gray-500 mb-8">Check back soon for new exciting deals!</p>
            <Link href="/shop">
              <Button className="bg-[#3BB77E] hover:bg-[#299E63] text-white font-bold h-12 px-8 rounded-full shadow-lg transition-all">
                Browse All Products
              </Button>
            </Link>
          </div>
        )}

        {/* Custom CSS to hide scrollbar */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </section>
    </main>
  );
}
