"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { brandService, type Brand } from "@/services/brand.service";

export default function BrandSection() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch brands from backend
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const brandsData = await brandService.getActive();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <section className="w-full bg-white py-6 sm:py-8 md:py-12">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header - matches Featured Categories / Best Deals */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-4 sm:mb-6 md:mb-8">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#253D4E] leading-tight">Shop by Brand</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Trusted brands, quality products</p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 px-3 py-2 md:px-5 md:py-3 md:min-h-[44px] flex items-center bg-[#005000] hover:bg-[#006600] text-white text-xs md:text-sm font-semibold transition-colors touch-manipulation rounded"
          >
            View More
          </Link>
        </div>

        {/* Brands Grid Container */}
        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#005000] animate-spin" />
            <span className="ml-2 sm:ml-3 text-gray-600 text-sm sm:text-base">Loading brands...</span>
          </div>
        ) : brands.length > 0 ? (
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-12">
              {brands.map((brandItem) => (
                <Link
                  key={brandItem.id}
                  href={`/shop?brand=${brandItem.id}`}
                  className="group flex flex-col items-center w-[88px] sm:w-[120px] md:w-[180px] flex-shrink-0"
                >
                  <div className="relative w-full h-16 sm:h-24 md:h-32 transition-all duration-300 group-hover:scale-105 sm:group-hover:scale-110">
                    <Image
                      src={brandItem.brandImg || "/images/brand/placeholder.jpg"}
                      alt={brandItem.brand}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 88px, (max-width: 768px) 120px, 180px"
                    />
                  </div>
                  <p className="text-center text-xs sm:text-sm font-medium text-gray-600 mt-1.5 sm:mt-2 group-hover:text-[#005000] transition-colors line-clamp-2">
                    {brandItem.brand}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No brands available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
