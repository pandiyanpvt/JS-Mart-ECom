"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const brands = [
  { id: 1, name: "Goldi", image: "/images/brand/image1.jpg" },
  { id: 2, name: "Maliban", image: "/images/brand/image2.jpg" },
  { id: 3, name: "Baby Cheramy", image: "/images/brand/image3.jpg" },
  { id: 4, name: "Magic", image: "/images/brand/image4.jpg" },
  { id: 5, name: "Kotmale", image: "/images/brand/image5.jpg" },
  { id: 6, name: "Kist", image: "/images/brand/image6.jpg" },
  { id: 7, name: "Marvel", image: "/images/brand/image7.jpg" },
  { id: 8, name: "Munchee", image: "/images/brand/image8.jpg" },
  { id: 9, name: "Surf Excel", image: "/images/brand/image9.jpg" },
  { id: 10, name: "Ceylon Since", image: "/images/brand/image10.png" },
];

export default function BrandSection() {
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
    <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-[#253D4E]">Shop by Brand</h2>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded bg-[#F2F3F4] flex items-center justify-center hover:bg-[#3BB77E] hover:text-white transition-all shadow-sm group"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-white" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded bg-[#F2F3F4] flex items-center justify-center hover:bg-[#3BB77E] hover:text-white transition-all shadow-sm group"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Scrollable Brands */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/products?brand=${brand.id}`}
            className="flex-shrink-0 group"
          >
            <div className="w-[180px] h-[100px] bg-white border border-gray-100 rounded-xl flex items-center justify-center p-4 transition-all duration-300 hover:shadow-lg hover:border-[#3BB77E]/30">
              <div className="relative w-full h-full">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-300 mix-blend-multiply"
                />
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
