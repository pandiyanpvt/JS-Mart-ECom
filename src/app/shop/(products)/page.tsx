"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products, categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronDown, Filter, Grid, List, SlidersHorizontal, ShoppingCart, Package } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = 12;

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Update selected category when URL param changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy]);

  const filteredProducts = useMemo(() => {
    let filtered = selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

    // Apply price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "low":
          return a.price - b.price;
        case "high":
          return b.price - a.price;
        case "newest":
        default:
          return 0; // Keep original order for newest
      }
    });

    return sorted;
  }, [selectedCategory, sortBy, priceRange]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const maxPrice = Math.max(...products.map(p => p.price));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Section */}
      <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <div className="relative overflow-hidden min-h-[250px] md:min-h-[350px] flex items-center justify-center shadow-lg rounded-[2rem]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/headers/shop-header.png"
              alt="Fresh Groceries"
              fill
              className="object-cover"
              priority
            />

          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl z-[1]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl z-[1]" />

          {/* Content */}
          <div className="relative z-10 text-center px-4 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-lg mb-4">
              Our Products
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Discover fresh, quality products delivered to your doorstep
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm text-[#253D4E]"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-[#3BB77E] text-white" : "text-gray-600"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-[#3BB77E] text-white" : "text-gray-600"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <p className="text-sm text-gray-600">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </p>
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-semibold text-[#253D4E] focus:outline-none focus:ring-2 focus:ring-[#3BB77E] focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDEBAR - Filters */}
          <aside className={`lg:col-span-3 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 sticky top-8">
              {/* Categories */}
              <div>
                <h3 className="font-extrabold text-[#253D4E] text-lg mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map(cat => (
                    <li key={cat.id}>
                      <button
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-semibold ${selectedCategory === cat.id
                          ? "bg-[#3BB77E] text-white"
                          : "text-[#253D4E] hover:bg-gray-50"
                          }`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-extrabold text-[#253D4E] text-lg mb-4">Filter by Price</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                    <span className="text-gray-500 font-semibold">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3BB77E]"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Rs. {priceRange[0]}</span>
                    <span>Rs. {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange([0, maxPrice]);
                }}
                variant="outline"
                className="w-full border-[#3BB77E] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white"
              >
                Clear All Filters
              </Button>
            </div>
          </aside>

          {/* PRODUCTS */}
          <main className="lg:col-span-9">
            {/* Product Grid */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className={`grid gap-6 ${viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
                  }`}>
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="border-gray-200 hover:bg-[#3BB77E] hover:text-white hover:border-[#3BB77E] disabled:opacity-50"
                    >
                      Previous
                    </Button>

                    {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                      let page;
                      if (totalPages <= 7) {
                        page = i + 1;
                      } else if (currentPage <= 4) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        page = totalPages - 6 + i;
                      } else {
                        page = currentPage - 3 + i;
                      }

                      return (
                        <Button
                          key={page}
                          size="sm"
                          variant={page === currentPage ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className={
                            page === currentPage
                              ? "bg-[#3BB77E] hover:bg-[#299E63] text-white"
                              : "border-gray-200 hover:bg-[#3BB77E] hover:text-white hover:border-[#3BB77E]"
                          }
                        >
                          {page}
                        </Button>
                      );
                    })}

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className="border-gray-200 hover:bg-[#3BB77E] hover:text-white hover:border-[#3BB77E] disabled:opacity-50"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-lg font-semibold text-gray-600 mb-2">No products found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
