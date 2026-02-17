"use client";

import React from "react";
import FeaturedCategories from "@/components/featured-categories";
import BrandSection from "@/components/brand-section";
import HeroSection from "@/components/hero-section";
import PopularProducts from "@/components/popular-products";
import MiddleBannerSection from "@/components/middle-banner-section";
import OfferCardSection from "@/components/offer-card-section";
import FooterBannerSection from "@/components/footer-banner-section";

export default function HomePage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      {/* Hero Slider Section */}
      <HeroSection />

      {/* Featured Categories - Horizontal Scroll */}
      <FeaturedCategories />

      {/* Popular Products - Horizontal Scroll */}
      <PopularProducts />

      {/* Middle Promotional Banners (Level 3) - Grid Layout */}
      <MiddleBannerSection />

      {/* Best Deals / Offer Cards Section */}
      <OfferCardSection />

      {/* Brand Section */}
      <BrandSection />

      {/* Footer Promotional Banners (Level 5) */}
      <FooterBannerSection />
    </main>
  );
}
