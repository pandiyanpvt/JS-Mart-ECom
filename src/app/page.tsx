


"use client";

import React from "react";
import FeaturedCategories from "@/components/featured-categories";
import AdvertisementSection from "@/components/advertisement-section";
import BrandSection from "@/components/brand-section";
import AdvertisementSection1 from "@/components/advertisement-section-one"
import AdvertisementSection2 from "@/components/advertisement-section-two";
import BestOfFruitVeg from "@/components/best-of-fruit-veg";
import HeroSection from "@/components/hero-section";

import PopularProducts from "@/components/popular-products";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center w-full pb-16">
      {/* Hero Section */}
      <HeroSection />
      {/* Advertisement Section */}
      <FeaturedCategories />
      {/* Popular Products */}
      <PopularProducts />
      {/* Advertisement Section 1 */}
      {/* Advertisement Section */}
      <AdvertisementSection />
      {/* Product Card */}
      <BestOfFruitVeg />
      {/* Dual Banners */}
      
        <AdvertisementSection1 />
        <AdvertisementSection2 />
      
      {/* Brand Section */}
      <BrandSection />
    </main>
  );
}
