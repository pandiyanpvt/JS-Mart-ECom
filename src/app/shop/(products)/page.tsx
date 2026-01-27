"use client";

import {useEffect, useMemo, useState} from "react";
import { products, categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import {ProductCard} from "@/components/product-card";

const ITEMS_PER_PAGE = 10;

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const filteredProducts =
      selectedCategory === "all"
          ? products
          : products.filter((p) => p.category === selectedCategory);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
      <div className="min-h-screen bg-white pb-20">
        <div className="container mx-auto px-6 py-8">

          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground mb-6">
            Home / Shop
          </div>

          {/* MAIN LAYOUT */}
          <div className="grid grid-cols-11 gap-8">

            {/* SIDEBAR */}
            <aside className="col-span-11 lg:col-span-2 space-y-6">

              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3">Product Categories</h3>
                <ul className="space-y-2 text-sm">
                  {categories.map(cat => (
                      <li
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className="cursor-pointer hover:text-primary"
                      >
                        {cat.name}
                      </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-semibold mb-3">Filter by price</h3>
                <input type="range" className="w-full" />
                <Button size="sm" className="mt-2 w-full">
                  Filter
                </Button>
              </div>
            </aside>

            {/* PRODUCTS */}
            <main className="col-span-12 lg:col-span-9">

              {/* Toolbar */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>

                <select
                    className="border px-3 py-2 rounded-md"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </div>

              {/* Product List */}
              <div className="space-y-6">
                {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                      Prev
                    </Button>

                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      return (
                          <Button
                              key={page}
                              size="sm"
                              variant={page === currentPage ? "default" : "outline"}
                              onClick={() => setCurrentPage(page)}
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
                    >
                      Next
                    </Button>

                  </div>
              )}

            </main>
          </div>
        </div>
      </div>
  );
}
