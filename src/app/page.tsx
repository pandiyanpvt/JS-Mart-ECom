


"use client";

import React from "react";
import CategorySection from "@/components/category-section";
import AdvertisementSection from "@/components/advertisement-section";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center w-full pb-16">
      {/* You can add a hero section or welcome text here */}
      {/* Advertisement Section */}
      <AdvertisementSection />
      {/* Category Section */}
      <CategorySection />
    </main>
  );
}
