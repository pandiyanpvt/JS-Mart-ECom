"use client";

import ShopGridSection from "@/components/sections/shop-grid-section";

const categories = [
  { id: 1, name: "Christmas Donation", image: "/images/category-section/donation.jpg" },
  { id: 2, name: "Vegetables", image: "/images/category-section/vegetables.jpg" },
  { id: 3, name: "Fruits", image: "/images/category-section/fruits.jpg" },
  { id: 4, name: "Baby Products", image: "/images/category-section/baby.jpg" },
  { id: 5, name: "Dairy", image: "/images/category-section/dairy.jpg" },
  { id: 6, name: "Beverages", image: "/images/category-section/beverages.jpg" },
  { id: 7, name: "Food Cupboard", image: "/images/category-section/food.jpg" },
  { id: 8, name: "Household", image: "/images/category-section/household.jpg" },
  { id: 9, name: "Cooking Essentials", image: "/images/category-section/cooking.jpg" },
  { id: 10, name: "Bakery", image: "/images/category-section/bakery.jpg" },
  { id: 11, name: "Frozen Food", image: "/images/category-section/frozen.jpg" },
  { id: 12, name: "Meats", image: "/images/category-section/meats.jpg" },
  { id: 13, name: "Seafood", image: "/images/category-section/seafood.jpg" },
  { id: 14, name: "Snacks & Confectionery", image: "/images/category-section/snacks.jpg" },
];

export default function CategorySection() {
  return (
    <ShopGridSection
      title="Shop by Category"
      items={categories}
      linkPrefix="/products?category="
      gridCols="grid-cols-4 sm:grid-cols-7"
      imageSize="w-20 h-20 sm:w-24 sm:h-24"
      showViewMore
      initialCount={14}
    />
  );
}
