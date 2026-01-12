


"use client";

import React from "react";
import CategorySection from "@/components/category-section";
import AdvertisementSection from "@/components/advertisement-section";
import BestOfFruitVeg from "@/components/product-card";
import BrandSection from "@/components/brand-section";
import AdvertisementSection1 from "@/components/advertisement-section-one"
import AdvertisementSection2 from "@/components/advertisement-section-two";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center w-full pb-16">
      {/* Advertisement Section */}
      <AdvertisementSection />
      {/* Category Section */}
      <CategorySection />
      {/* Advertisement Section 1 */}
      <AdvertisementSection1/>
      {/* Product Card */}
      <BestOfFruitVeg />
      {/* Advertisement Section 2 */}
      <AdvertisementSection2/>
      {/* Brand Section */}
      <BrandSection />
    </main>
  );
}
