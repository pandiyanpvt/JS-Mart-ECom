"use client";

import ShopGridSection from "@/components/sections/shop-grid-section";

const brands = [
  { id: 1, name: "Goldi", image: "/images/brand/image1.jpg" },
  { id: 2, name: "Maliban", image: "/images/brand/image2.jpg" },
  { id: 3, name: "Baby Cheramy", image: "/images/brand/image3.jpg" },
  { id: 4, name: "Magic", image: "/images/brand/image4.jpg" },
  { id: 5, name: "Kotmale", image: "/images/brand/image5.jpg" },
  { id: 6, name: "Kist", image: "/images/brand/image6.jpg" },
  { id: 7, name: "Marvel", image: "/images/brand/image7.jpg" },
  { id: 8, name: "Munchee", image: "/images/brand/image8.jpg" },
  { id: 9, name: "Surf Excel", image: "/images/brand/image9.jpg" },
  { id: 10, name: "Ceylon Since", image: "/images/brand/image10.png" },
];

export default function BrandSection() {
  return (
    <ShopGridSection
      title="Shop by Brand"
      items={brands}
      linkPrefix="/products?brand="
      gridCols="grid-cols-3 sm:grid-cols-5"
      imageSize="w-28 h-28 sm:w-40 sm:h-40"
    />
  );
}
