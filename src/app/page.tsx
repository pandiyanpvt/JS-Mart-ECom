"use client";

import React, { useEffect, useState } from "react";
import FeaturedCategories from "@/components/featured-categories";
import BrandSection from "@/components/brand-section";
import HeroSection from "@/components/hero-section";
import PopularProducts from "@/components/popular-products";
import MiddleBannerSection from "@/components/middle-banner-section";
import OfferCardSection from "@/components/offer-card-section";
import HomeMembershipSection from "@/components/home-membership-section";
import FooterBannerSection from "@/components/footer-banner-section";
import PromoStatsStrip from "@/components/promo/PromoStatsStrip";
import FlashSaleBanner from "@/components/promo/FlashSaleBanner";
import CouponDealsStrip from "@/components/promo/CouponDealsStrip";
import { offerService } from "@/services/offer.service";

export default function HomePage() {
  const [activeOffersCount, setActiveOffersCount] = useState(0);
  const [dealsCount, setDealsCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const offers = await offerService.getAllOffers();
        const now = new Date();
        const active = (offers as any[]).filter(
          (o) =>
            o.isActive &&
            new Date(o.startDate) <= now &&
            new Date(o.endDate) >= now
        );
        const withCoupon = active.filter((o) => o.couponCode);
        setActiveOffersCount(active.length);
        setDealsCount(withCoupon.length > 0 ? withCoupon.length : active.length);
      } catch {
        setActiveOffersCount(0);
        setDealsCount(0);
      }
    };
    fetchCounts();
  }, []);

  return (
    <main className="flex flex-col w-full min-h-screen min-w-0 overflow-x-hidden bg-white">
      {/* Hero Slider - Full width, no top gap (spacer in Navbar pushes this below fixed nav) */}
      <section className="w-full pt-0 pb-2 md:pb-4">
        <div className="w-full overflow-hidden">
          <HeroSection />
        </div>
      </section>

      {/* Promo Stats Strip - Admin style (Deals, Coupons, Save More) */}
      <PromoStatsStrip
        activeOffersCount={activeOffersCount}
        dealsCount={dealsCount}
        redemptionsLabel="Save More"
      />

      {/* Featured Categories */}
      <section className="bg-white">
        <FeaturedCategories />
      </section>

      {/* Flash Sale / Urgency Banner */}
      <FlashSaleBanner />

      {/* Popular Products */}
      <section className="bg-slate-50">
        <PopularProducts />
      </section>

      {/* Coupon Codes Strip - Ticket-style cards */}
      <CouponDealsStrip />

      {/* Mid-Page Banners - Level 3 */}
      <MiddleBannerSection />

      {/* Best Deals / Offer Cards - with images from admin (bannerImg or product) */}
      <OfferCardSection />

      {/* Membership - plan highlights */}
      <HomeMembershipSection />

      {/* Brand Section */}
      <BrandSection />

      {/* Footer Promotional Banners - Level 5 */}
      <FooterBannerSection />
    </main>
  );
}
