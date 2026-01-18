"use client";

import { useState } from "react";
import { products, categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("Sort by");

  const filterOptions = ["Offer", "Brands"];
  const filteredProducts =
      selectedCategory === "all"
          ? products
          : products.filter((p) => p.category === selectedCategory);

  const selectedCategoryName =
      categories.find((c) => c.id === selectedCategory)?.name || "All Categories";

  return (
      <div className="min-h-screen bg-white dark:bg-black/5 pb-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-8">

          {/* Page Title */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              All Products
            </h2>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer">Home</span>
            <span className="mx-2">&gt;</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{selectedCategoryName}</span>
          </nav>

          {/* Filter Toolbar */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" className="bg-[#0B4635] text-white h-10 px-4">
                    {selectedCategoryName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {categories.map((category) => (
                      <DropdownMenuItem key={category.id} onClick={() => setSelectedCategory(category.id)}>
                        {category.name}
                      </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Other Filters */}
              {filterOptions.map((filter) => (
                  <DropdownMenu key={filter}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-10 px-3 min-w-[5rem] justify-between">
                        {filter} <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Option 1</DropdownMenuItem>
                      <DropdownMenuItem>Option 2</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              ))}
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10">
                    {sortBy} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("Price: Low to High")}>Price: Low to High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("Price: High to Low")}>Price: High to Low</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("Newest")}>Newest</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
  );
}
