"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Tag, Sparkles, Percent } from "lucide-react";

export default function OffersPage() {
  // Filter products that have a discount (originalPrice > price) or an "OFF"/ "Sale" badge
  const offerProducts = useMemo(() => {
    return products.filter(product =>
      (product.originalPrice && product.originalPrice > product.price) ||
      product.badges?.some(badge => badge.includes("OFF") || badge.includes("Sale"))
    );
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-12">

        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-[#5DC440] transition-colors">Home</Link>
          <span className="mx-2 text-gray-400 font-bold">&gt;</span>
          <span className="font-medium text-gray-900">Special Offers</span>
        </nav>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0B4635] min-h-[500px] flex items-center shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#5DC440_0%,transparent_50%)]" />
          </div>

          <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center px-8 md:px-12 lg:px-20">
            <div className="space-y-8 py-12 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 animate-bounce group cursor-default">
                <div className="h-6 w-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <span className="text-white font-black text-xs tracking-widest uppercase">Shocking Deals!</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                  WEEKLY <br />
                  <span className="text-[#5DC440] inline-block hover:scale-105 transition-transform cursor-default">PRICEDROPS</span>
                </h1>
                <p className="text-emerald-50/70 text-lg md:text-xl font-medium max-w-lg mx-auto lg:mx-0">
                  Australia's freshest groceries are now more affordable. Stock up on your favorites with exclusive member-only discounts.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-black h-14 px-10 rounded-2xl text-lg shadow-xl shadow-yellow-400/20 transition-all hover:-translate-y-1">
                  Claim Offers Now
                </Button>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-[#0B4635] bg-gray-200 overflow-hidden shadow-lg">
                      <Image
                        src={`https://i.pravatar.cc/150?u=${i + 10}`}
                        alt="User"
                        width={40}
                        height={40}
                      />
                    </div>
                  ))}
                  <div className="h-10 px-4 rounded-full border-2 border-[#0B4635] bg-white flex items-center justify-center text-[10px] font-black text-black shadow-lg">
                    5K+ SATISFIED
                  </div>
                </div>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-square w-full max-w-[500px] ml-auto">
                <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl animate-pulse" />
                <div className="relative z-10 w-full h-full transform hover:scale-105 transition-transform duration-700">
                  <Image
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                    alt="Fresh Grocery Basket"
                    fill
                    className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
                  />
                </div>

                {/* Discount Badge */}
                <div className="absolute -top-4 -left-4 bg-[#5DC440] h-24 w-24 rounded-full flex flex-col items-center justify-center shadow-2xl rotate-12 animate-pulse border-4 border-[#0B4635]">
                  <span className="text-white font-black text-2xl leading-none">50%</span>
                  <span className="text-white font-bold text-xs">OFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Grid Section */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-[#5DC440] rounded-full" />
                <span className="text-[#5DC440] font-bold text-sm tracking-widest uppercase">Hot Deals</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Today&apos;s Featured Offers</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-500">{offerProducts.length} items found</span>
              <div className="h-10 w-px bg-gray-200 hidden md:block" />
              <Button variant="outline" className="border-gray-200 text-gray-600 font-bold hover:border-[#5DC440] hover:text-[#5DC440]">
                <Percent className="mr-2 h-4 w-4" />
                Highest Discount
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {offerProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {offerProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
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
                <Button className="bg-[#5DC440] hover:bg-[#4eb335] text-white font-bold h-12 px-8 rounded-full shadow-lg transition-all">
                  Browse All Products
                </Button>
              </Link>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
