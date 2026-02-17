"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Tag, Percent } from "lucide-react";
import { offerService } from "@/services/offer.service";
import HeroSection, { HeroSlide } from "@/components/hero-section";
import { membershipService, UserSubscription } from "@/services/membership.service";
import { Crown, Gem, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const offersHeroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Special Offers",
    subtitle: "Discover Amazing Deals",
    description: "Save big on your favorite products today.",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    image: "/images/headers/offers-header.png"
  }
];

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [offersData, subData] = await Promise.all([
          offerService.getAllOffers(),
          membershipService.getMySubscription()
        ]);
        setOffers(offersData);
        setSubscription(subData);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);




  // Transform backend offers to Product format
  const offerProducts = useMemo(() => {
    if (!offers || offers.length === 0) return [];

    return offers.map((offer: any) => {
      const product = offer.Product || offer.product;

      // If no product and not a storewide/cart level offer, we usually hide it 
      // but let's be inclusive as the user wants to see all offers.
      const originalPrice = product ? parseFloat(product.productPrice) : 0;
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
          badges.push(`AUD ${offer.discountAmount} OFF`);
        }
      }
      // Type 1: BOGO
      else if (offer.offerTypeId === 1) {
        const free = offer.freeProduct?.productName ? ` ${offer.freeProduct.productName}` : '';
        badges.push(`Buy ${offer.buyQuantity} Get ${offer.getQuantity}${free}`);
      }
      // Type 4: Free Gift
      else if (offer.offerTypeId === 4) {
        const gift = offer.freeProduct?.productName || "Gift";
        if (offer.buyQuantity && offer.buyQuantity > 0) {
          badges.push(`Buy ${offer.buyQuantity} Get ${offer.getQuantity || 1} ${gift} Free`);
        } else {
          badges.push(`Free ${gift}`);
        }
      }
      // Type 3: Cart Level
      else if (offer.offerTypeId === 3) {
        badges.push(`Min Order AUD ${offer.minOrderAmount}`);
        if (offer.discountPercentage) badges.push(`${offer.discountPercentage}% OFF Cart`);
        if (offer.discountAmount) badges.push(`AUD ${offer.discountAmount} OFF Cart`);
      }

      // Add Expiry Badge
      if (offer.endDate) {
        const daysLeft = Math.ceil((new Date(offer.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 3 && daysLeft > 0) {
          badges.push(`${daysLeft} Day${daysLeft > 1 ? 's' : ''} Left`);
        }
      }

      return {
        id: product?.id || offer.id,
        name: product?.productName || "General Offer",
        offerName: offer.name, // Added offer name for banner title
        price: discountedPrice,
        originalPrice: originalPrice,
        image: offer.bannerImg || product?.productImage || "/images/placeholder.png", // Prioritize Offer Banner
        description: product?.productDescription || offer.description || "Limited time storewide promotion",
        category: "Offers",
        badges: badges,
        weight: "1kg", // Default
        inStock: true,
        brand: "JS Mart",
        offerTypeId: offer.offerTypeId, // Added for button logic
        offerId: offer.id,
        targetMembershipLevel: offer.targetMembershipLevel
      };
    }).filter((item: any) => {
      if (!item || !item.offerId) return false;
      const offer = offers.find((o: any) => o.id === item.offerId);
      if (!offer) return false;

      const now = new Date();
      const startDate = new Date(offer.startDate);
      const endDate = offer.endDate ? new Date(offer.endDate) : null;

      const isActive = offer.isActive !== false;
      const hasStarted = isNaN(startDate.getTime()) || startDate <= now;
      const notEnded = !endDate || isNaN(endDate.getTime()) || endDate >= now;

      return isActive && hasStarted && notEnded;
    });
  }, [offers, subscription]);



  return (
    <main className="flex flex-col w-full pb-16 bg-white">
      <HeroSection slides={offersHeroSlides} />


      {/* Offers Section */}
      <section className="w-full py-12 px-4 md:px-6 lg:px-8 max-w-[1600px]">


        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#253D4E]">Featured Deals</h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1 md:mt-2">Don't miss out on these incredible savings</p>
          </div>

          {/* Navigation Arrows (Removed as per user request) */}
        </div>

        {/* Offer Items List */}
        {offerProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {offerProducts.map((item: any) => (
              <div key={item.offerId || item.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
                {/* Banner Image */}
                <div className="relative w-full h-[150px] md:h-[250px] bg-gray-50 p-2 md:p-4">
                  <Image
                    src={item.image || "/images/placeholder.png"}
                    alt={item.offerName || item.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {item.targetMembershipLevel > 0 && (
                      <span className={cn(
                        "flex items-center gap-1.5 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md uppercase tracking-widest",
                        item.targetMembershipLevel === 2 ? "bg-amber-500" : "bg-indigo-600"
                      )}>
                        {item.targetMembershipLevel === 2 ? <Gem size={12} /> : <Zap size={12} />}
                        {item.targetMembershipLevel === 2 ? "JS Plus Exclusive" : "JS Pro Member"}
                      </span>
                    )}
                    {item.badges.map((badge: string, idx: number) => (
                      <span key={idx} className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-8 flex flex-col justify-center flex-1">
                  <div className="mb-2 md:mb-4">
                    {item.offerName && <h3 className="text-lg md:text-2xl font-black text-gray-900 mb-1 leading-tight line-clamp-2">{item.offerName}</h3>}
                    <p className="text-xs md:text-lg font-medium text-gray-500 line-clamp-1">{item.name}</p>
                  </div>

                  {item.description && (
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">{item.description}</p>
                  )}

                  <div className="mt-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 md:gap-4">
                    {item.price > 0 ? (
                      <div>
                        <span className="text-xl md:text-3xl font-black text-[#005000]">AUD {item.price.toLocaleString()}</span>
                        {item.price < item.originalPrice && (
                          <span className="ml-2 md:ml-3 text-[10px] md:text-sm text-gray-400 line-through font-medium block sm:inline">AUD {item.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                    ) : (
                      <div className="h-4 md:h-8"></div>
                    )}

                    <Link href={item.offerTypeId === 3 ? "/shop" : `/shop/${item.id}`} className="w-full sm:w-auto">
                      <Button className="w-full sm:w-auto bg-[#005000] hover:bg-[#006600] text-white font-bold h-10 md:h-12 px-4 md:px-8 rounded-xl shadow-lg transition-all cursor-pointer text-xs md:text-base">
                        Claim Offer
                      </Button>
                    </Link>
                  </div>
                </div>
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
