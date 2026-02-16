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
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#253D4E]">Shop by Brand</h2>
            <p className="text-gray-500 text-sm mt-2">Trusted brands, quality products</p>
          </div>
        </div>

        {/* Brands Grid Container */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#005000] animate-spin" />
            <span className="ml-3 text-gray-600">Loading brands...</span>
          </div>
        ) : brands.length > 0 ? (
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {brands.map((brandItem) => (
                <Link
                  key={brandItem.id}
                  href={`/shop?brand=${brandItem.id}`}
                  className="group flex flex-col items-center w-[140px] md:w-[180px]"
                >
                  <div className="relative w-full h-24 md:h-32 transition-all duration-300 group-hover:scale-110">
                    <Image
                      src={brandItem.brandImg || "/images/brand/placeholder.jpg"}
                      alt={brandItem.brand}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 140px, 180px"
                    />
                  </div>
                  <p className="text-center text-sm font-medium text-gray-600 mt-2 group-hover:text-[#005000] transition-colors">
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
