"use client";

import { useState } from "react";
import { products, categories } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter } from "lucide-react";
import Image from "next/image";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Sort by");

  const filterOptions = ["Offer", "Brands"];

  return (
    <div className="min-h-screen bg-white dark:bg-black/5 pb-20">

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-8">


        {/* Promotional Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0B4635] text-white">
          <div className="relative z-10 flex flex-col justify-center p-8 md:p-12 lg:p-16 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Get free delivery on <br /> shopping $200
            </h1>
            <p className="text-emerald-100 text-sm md:text-base max-w-lg mb-8 leading-relaxed">
              Get the freshness groceries delivered right to your home. Save time, skip the lines, and enjoy the convenience of quick, efficient delivery.
            </p>
            <Button className="w-fit bg-[#EAB308] hover:bg-[#CA9A06] text-black font-semibold rounded-full px-8">
              Learn More <ChevronDown className="ml-2 h-4 w-4 -rotate-90" />
            </Button>
          </div>
          {/* Background pattern/Image placeholder */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
            <div className="relative h-full w-full">
              {/* Using a placeholder image for the basket of vegetables - matching the vibe */}
              <Image
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                alt="Basket of vegetables"
                fill
                className="object-cover object-center translate-x-12 translate-y-4 scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0B4635]/20 to-[#0B4635]" />
            </div>
          </div>
        </div>

        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">All Products</h2>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span className="hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer">Home</span>
          <span className="mx-2">&gt;</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{selectedCategory}</span>
        </nav>

        {/* Filter Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {/* All Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive py-2 has-[>svg]:px-3 bg-[#0B4635] hover:bg-[#083629] text-white rounded-md h-10 px-4"
                >
                  {selectedCategory}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Other Filters */}
            {filterOptions.map((filter) => (
              <DropdownMenu key={filter}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-gray-200 text-gray-600 dark:border-zinc-800 dark:text-gray-400 h-10 px-3 min-w-[5rem] justify-between">
                    {filter}
                    <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
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
                <Button variant="outline" className="border-gray-200 text-gray-600 dark:border-zinc-800 dark:text-gray-400 h-10">
                  {sortBy}
                  <ChevronDown className="ml-2 h-4 w-4" />
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

        {/* Filters Button (Mobile) - Alternative to horizontal scroll if needed, but horizontal flex wrap works well */}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-1 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center pt-8">
          <Button variant="outline" className="border-gray-200 text-gray-600 dark:border-zinc-800 text-base px-8 h-12">
            Load More
          </Button>
        </div>

      </div>
    </div>
  );
}
