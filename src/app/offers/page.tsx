"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Tag, Percent } from "lucide-react";
import Image from "next/image";
import { offerService } from "@/services/offer.service";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await offerService.getAllOffers();
        setOffers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOffers();
  }, []);


  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Transform backend offers to Product format
  const offerProducts = useMemo(() => {
    if (!offers || offers.length === 0) return [];

    return offers.map((offer: any) => {
      const product = offer.Product || offer.product;
      if (!product) return null;

      const originalPrice = parseFloat(product.productPrice);
      let discountedPrice = originalPrice;
      const badges = [];

      // Handle different offer types
      // Type 2: Discount (Percentage or Fixed Amount)
      if (offer.offerTypeId === 2) {
        if (offer.discountPercentage > 0) {
          discountedPrice = originalPrice - (originalPrice * (offer.discountPercentage / 100));
          // ProductCard handles percentage badge automatically based on price diff
        } else if (offer.discountAmount > 0) {
          discountedPrice = Math.max(0, originalPrice - offer.discountAmount);
          // Fixed amount discount will be shown as percentage by ProductCard, or we can add specific badge
          badges.push(`Rs. ${offer.discountAmount} OFF`);
        }
      }
      // Type 1: BOGO
      else if (offer.offerTypeId === 1) {
        badges.push(`Buy ${offer.buyQuantity} Get ${offer.getQuantity}`);
      }
      // Type 4: Free Gift
      else if (offer.offerTypeId === 4) {
        badges.push("Free Gift");
      }
      // Type 3: Cart Level
      else if (offer.offerTypeId === 3) {
        badges.push(`Min Order Rs. ${offer.minOrderAmount}`);
        if (offer.discountPercentage) badges.push(`${offer.discountPercentage}% OFF Cart`);
        if (offer.discountAmount) badges.push(`Rs. ${offer.discountAmount} OFF Cart`);
      }

      // Add Expiry Badge
      if (offer.endDate) {
        const daysLeft = Math.ceil((new Date(offer.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 3 && daysLeft > 0) {
          badges.push(`${daysLeft} Day${daysLeft > 1 ? 's' : ''} Left`);
        }
      }

      return {
        id: product.id,
        name: product.productName,
        offerName: offer.name, // Added offer name for banner title
        price: discountedPrice,
        originalPrice: originalPrice,
        image: offer.bannerImg || product.productImage, // Prioritize Offer Banner
        description: product.productDescription,
        category: "Offers",
        badges: badges,
        weight: "1kg", // Default
        inStock: true,
        brand: "JS Mart"
      };
    }).filter((item: any) => item !== null && (offers.find((o: any) => (o.Product?.id || o.product?.id) === item.id)?.isActive !== false));
  }, [offers]);

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
      <section className="w-full pt-[100px]">
        <div className="w-full">
          <div className="relative overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center justify-center">
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

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-lg mb-4">
                Special Offers
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                Discover amazing deals on your favorite products. Save big today!
              </p>
            </div>
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
                className="w-8 h-8 rounded bg-[#005000] flex items-center justify-center hover:bg-[#006600] transition-all shadow-sm group"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded bg-[#005000] flex items-center justify-center hover:bg-[#006600] transition-all shadow-sm group"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Products */}
        {offerProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerProducts.map((item: any) => (
              <Link key={item.id} href={`/shop/${item.id}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full block">
                {/* Banner Image */}
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={item.image || "/images/placeholder.png"}
                    alt={item.offerName || item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.badges.map((badge: string, idx: number) => (
                      <span key={idx} className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    {item.offerName && <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">{item.offerName}</h3>}
                    <p className="text-sm font-medium text-gray-500">{item.name}</p>
                  </div>

                  {item.description && (
                    <p className="text-gray-400 text-xs mb-6 line-clamp-2">{item.description}</p>
                  )}

                  <div className="mt-auto flex items-end justify-between">
                    {item.price > 0 ? (
                      <div>
                        <span className="text-2xl font-black text-[#253D4E]">Rs. {item.price.toLocaleString()}</span>
                        {item.price < item.originalPrice && (
                          <span className="block text-xs text-gray-400 line-through font-medium">Rs. {item.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                    ) : (
                      <div className="h-8"></div>
                    )}
                  </div>
                </div>
              </Link>
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
              <Button className="bg-[#005000] hover:bg-[#006600] text-white font-bold h-12 px-8 rounded-full shadow-lg transition-all">
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
    </main >
  );
}
