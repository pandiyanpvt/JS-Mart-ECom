"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronDown, Filter, Grid, List, SlidersHorizontal, ShoppingCart, Package, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { productService, categoryService } from "@/services";
import type { Product } from "@/services/product.service";
import { getProductImages, getProductImageUrl } from "@/services/product.service";
import type { Category } from "@/services/category.service";

const ITEMS_PER_PAGE = 12;

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          categoryService.getActive()
        ]);

        setProducts(productsData);
        setCategories(categoriesData);

        if (productsData.length > 0) {
          const maxProductPrice = Math.max(...productsData.map(p => Number(p.price)));
          setPriceRange([0, maxProductPrice]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCategory(initialCategory || "all");
  }, [initialCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const url = categoryId === "all" ? "/shop" : `/shop?category=${categoryId}`;
    router.replace(url, { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    let filtered = selectedCategory === "all"
      ? products
      : products.filter((p) => {
        return p.productCategoryId === Number(selectedCategory) ||
          p.product_category?.category === selectedCategory;
      });

    filtered = filtered.filter(
      (p) => Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1]
    );

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "low":
          return Number(a.price) - Number(b.price);
        case "high":
          return Number(b.price) - Number(a.price);
        case "newest":
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, selectedCategory, sortBy, priceRange]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const categoryBanners: { [key: string]: { image: string; title: string; description: string } } = {
    all: {
      image: "/images/headers/shop-header.png",
      title: "Our Products",
      description: "Discover fresh, quality products delivered to your doorstep"
    },
    "1": {
      image: "/slider-1.png",
      title: "Fresh Vegetables",
      description: "Farm-fresh vegetables delivered daily to your door"
    },
  };

  const selectedCategoryObj = categories.find(c => String(c.id) === selectedCategory);

  let currentBanner = categoryBanners.all;

  if (selectedCategory !== "all") {
    if (categoryBanners[selectedCategory]) {
      currentBanner = categoryBanners[selectedCategory];
    } else if (selectedCategoryObj) {
      currentBanner = {
        image: "/images/headers/shop-header.png",
        title: selectedCategoryObj.category,
        description: `Explore our premium collection of ${selectedCategoryObj.category.toLowerCase()}`
      };
    }
  }

  const maxPrice = products.length > 0 ? Math.max(...products.map(p => Number(p.price))) : 10000;

  const adaptProduct = (backendProduct: Product) => {
    const imgs = getProductImages(backendProduct);
    const primary = imgs.find(img => img.isPrimary) || imgs[0];
    const primaryImage = primary ? getProductImageUrl(primary) : '/images/products/placeholder.png';

    return {
      id: String(backendProduct.id),
      name: backendProduct.productName,
      category: backendProduct.product_category?.category || 'Uncategorized',
      price: Number(backendProduct.price),
      originalPrice: undefined,
      image: primaryImage,
      rating: 4,
      reviews: 45,
      description: backendProduct.description || '',
      stock: backendProduct.quantity,
      weight: backendProduct.weight ? `${backendProduct.weight}g` : '1kg',
      brand: (backendProduct.brand as { brand?: string; brandName?: string } | undefined)?.brand ?? (backendProduct.brand as { brand?: string; brandName?: string } | undefined)?.brandName ?? '',
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="w-full pt-[100px]">
        <div className="w-full">
          <div className="relative overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 z-0">
              <Image
                src={currentBanner.image}
                alt={currentBanner.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 text-center px-4 max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-lg mb-4">
                {currentBanner.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                {currentBanner.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
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
                className={`p-2 rounded ${viewMode === "grid" ? "bg-[#005000] text-white" : "text-gray-600"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-[#005000] text-white" : "text-gray-600"}`}
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
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-semibold text-[#253D4E] focus:outline-none focus:ring-2 focus:ring-[#005000] focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className={`lg:col-span-3 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 sticky top-8">
              <div>
                <h3 className="font-extrabold text-[#253D4E] text-lg mb-4">Categories</h3>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-[#005000]" />
                  </div>
                ) : (
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => handleCategoryChange("all")}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-semibold ${selectedCategory === "all"
                          ? "bg-[#005000] text-white"
                          : "text-[#253D4E] hover:bg-gray-50"
                          }`}
                      >
                        All Products
                      </button>
                    </li>
                    {categories.map(cat => (
                      <li key={cat.id}>
                        <button
                          onClick={() => handleCategoryChange(String(cat.id))}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-semibold ${selectedCategory === String(cat.id)
                            ? "bg-[#005000] text-white"
                            : "text-[#253D4E] hover:bg-gray-50"
                            }`}
                        >
                          {cat.category}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#005000]"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Rs. {priceRange[0]}</span>
                    <span>Rs. {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  handleCategoryChange("all");
                  setPriceRange([0, maxPrice]);
                }}
                variant="outline"
                className="w-full border-[#005000] text-[#005000] hover:bg-[#005000] hover:text-white"
              >
                Clear All Filters
              </Button>
            </div>
          </aside>

          <main className="lg:col-span-9">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-[#005000] mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold">Loading products...</p>
                </div>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <div className={`grid gap-6 ${viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
                  }`}>
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={adaptProduct(product)} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="border-gray-200 hover:bg-[#005000] hover:text-white hover:border-[#005000] disabled:opacity-50"
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
                              ? "bg-[#005000] hover:bg-[#006600] text-white"
                              : "border-gray-200 hover:bg-[#005000] hover:text-white hover:border-[#005000]"
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
                      className="border-gray-200 hover:bg-[#005000] hover:text-white hover:border-[#005000] disabled:opacity-50"
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
