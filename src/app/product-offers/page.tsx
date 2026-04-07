"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { offerService } from "@/services/offer.service";
import PageHero from "@/components/page-hero";
import { membershipService, UserSubscription } from "@/services/membership.service";
import { Gem, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveImageSrc } from "@/lib/images";

// Product-based offer types: 1 = BOGO, 2 = Discount, 4 = Free Gift. Exclude 3 = Cart Level.
const PRODUCT_OFFER_TYPE_IDS = [1, 2, 4];

export default function ProductOffersPage() {
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

  const offerProducts = useMemo(() => {
    if (!offers || offers.length === 0) return [];

    return offers
      .filter((offer: any) => PRODUCT_OFFER_TYPE_IDS.includes(offer.offerTypeId))
      .map((offer: any) => {
        const product = offer.Product || offer.product;
        if (!product) return null;

        const originalPrice = parseFloat(product.productPrice) || 0;
        let discountedPrice = originalPrice;
        const badges = [];

        if (offer.offerTypeId === 2) {
          if (offer.discountPercentage > 0) {
            discountedPrice = originalPrice - (originalPrice * (offer.discountPercentage / 100));
          } else if (offer.discountAmount > 0) {
            discountedPrice = Math.max(0, originalPrice - offer.discountAmount);
            badges.push(`AUD ${offer.discountAmount} OFF`);
          }
        } else if (offer.offerTypeId === 1) {
          const free = offer.freeProduct?.productName ? ` ${offer.freeProduct.productName}` : '';
          badges.push(`Buy ${offer.buyQuantity} Get ${offer.getQuantity}${free}`);
        } else if (offer.offerTypeId === 4) {
          const gift = offer.freeProduct?.productName || "Gift";
          if (offer.buyQuantity && offer.buyQuantity > 0) {
            badges.push(`Buy ${offer.buyQuantity} Get ${offer.getQuantity || 1} ${gift} Free`);
          } else {
            badges.push(`Free ${gift}`);
          }
        }

        if (offer.endDate) {
          const daysLeft = Math.ceil((new Date(offer.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (daysLeft <= 3 && daysLeft > 0) {
            badges.push(`${daysLeft} Day${daysLeft > 1 ? 's' : ''} Left`);
          }
        }

        return {
          id: product.id,
          name: product.productName,
          offerName: offer.name,
          price: discountedPrice,
          originalPrice: originalPrice,
          image: resolveImageSrc(offer.bannerImg || product.productImage),
          description: product.productDescription || offer.description || "",
          category: "Offers",
          badges,
          weight: "Per unit",
          inStock: true,
          brand: "JS Mart",
          offerTypeId: offer.offerTypeId,
          offerId: offer.id,
          targetMembershipLevel: offer.targetMembershipLevel
        };
      })
      .filter(Boolean)
      .filter((item: any) => {
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
    <main className="flex flex-col w-full min-w-0 overflow-x-hidden pb-[max(4rem,env(safe-area-inset-bottom))] bg-white">
      <PageHero
        image="/images/headers/offers-header.png"
        imageAlt="Product offers"
        title="Product Offers"
        subtitle="Save on individual products with exclusive BOGO, discounts, and free gift deals."
        align="center"
      />

      <section className="w-full mx-auto py-12 px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#253D4E]">Product Deals</h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1 md:mt-2">Product-based offers only</p>
          </div>
        </div>

        {offerProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {offerProducts.map((item: any) => (
              <div key={item.offerId || item.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
                <div className="relative w-full bg-gray-50 flex items-center justify-center h-[140px] md:h-[180px]">
                  <Image
                    src={item.image}
                    alt={item.offerName || item.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
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

                    <Link href={`/shop/${item.id}`} className="w-full sm:w-auto">
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">No product offers right now</h3>
            <p className="text-gray-500 mb-8">Check back soon or browse all offers.</p>
            <div className="flex gap-4">
              <Link href="/offers">
                <Button variant="outline" className="font-bold h-12 px-8 rounded-full">
                  View All Offers
                </Button>
              </Link>
              <Link href="/shop">
                <Button className="bg-[#005000] hover:bg-[#006600] text-white font-bold h-12 px-8 rounded-full shadow-lg transition-all">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        )}

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </section>
    </main>
  );
}
