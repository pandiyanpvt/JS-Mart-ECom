"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Heading } from "@/components/ui/heading"
export default function CategorySection() {
  const [showAll, setShowAll] = useState(false);

  // Dummy categories
  const categories = [
    { id: 1, name: "Christmas Donation", category_image: "/images/category-section/donation.jpg" },
    { id: 2, name: "Vegetables", category_image: "/images/category-section/vegetables.jpg" },
    { id: 3, name: "Fruits", category_image: "images/category-section/fruits.jpg" },
    { id: 4, name: "Baby Products", category_image: "images/category-section/baby.jpg" },
    { id: 5, name: "Dairy", category_image: "images/category-section/dairy.jpg" },
    { id: 6, name: "Beverages", category_image: "images/category-section/beverages.jpg" },
    { id: 7, name: "Food Cupboard", category_image: "images/category-section/food.jpg" },
    { id: 8, name: "Household", category_image: "images/category-section/household.jpg" },
    { id: 9, name: "Cooking Essentials", category_image: "images/category-section/cooking.jpg" },
    { id: 10, name: "Bakery", category_image: "images/category-section/bakery.jpg" },
    { id: 11, name: "Frozen Food", category_image: "images/category-section/frozen.jpg" },
    { id: 12, name: "Meats", category_image: "images/category-section/meats.jpg" },
    { id: 13, name: "Seafood", category_image: "images/category-section/seafood.jpg" },
    { id: 14, name: "Snacks & Confectionery", category_image: "images/category-section/snacks.jpg" },
  ];

  const displayedCategories = showAll ? categories : categories.slice(0, 7);

  return (
    <section aria-labelledby="category-heading" className="pt-8 sm:pt-24 xl:mx-auto xl:max-w-7xl xl:px-8">
      {/* Heading */}

      <div className="px-4 sm:px-6 lg:px-8 xl:px-0 flex items-center justify-between">
        <Heading id="category-heading" className=" tracking-tight">
          Shop by Category
        </Heading>
        <div className="hidden sm:flex">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-red-600 font-semibold text-sm hover:underline"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-6 grid grid-cols-7 gap-6 place-items-center mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
        {displayedCategories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            className="flex flex-col items-center justify-start"

          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-gray-200">
              <img
                src={category.category_image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-2 text-center text-sm font-medium">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
