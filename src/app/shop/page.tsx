"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronDown, Filter, Grid, List, SlidersHorizontal, ShoppingCart, Package, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductListCard } from "@/components/product-list-card";
import { Input } from "@/components/ui/input";
import { productService, categoryService } from "@/services";
import { brandService } from "@/services/brand.service";
import type { Brand } from "@/services/brand.service";
import { offerService } from "@/services/offer.service";
import type { Product } from "@/services/product.service";
import { getProductImages, getProductImageUrl } from "@/services/product.service";
import type { Category } from "@/services/category.service";
import { calculateProductDiscount, formatOfferValidity, type Offer } from "@/utils/offerUtils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ITEMS_PER_PAGE = 12;

// Helper to get all category IDs including subcategories
const getAllCategoryIds = (category: Category): number[] => {
  let ids = [category.id];
  if (category.subCategories) {
    category.subCategories.forEach(sub => {
      ids = [...ids, ...getAllCategoryIds(sub)];
    });
  }
  return ids;
};

const CategoryItem = ({
  category,
  handleCategoryChange,
  selectedCategory,
  level = 0
}: {
  category: Category;
  handleCategoryChange: (id: string) => void;
  selectedCategory: string;
  level?: number;
}) => {
  const isSelected = selectedCategory === String(category.id);

  return (
    <li>
      <button
        onClick={() => handleCategoryChange(String(category.id))}
        className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-semibold flex items-center justify-between ${isSelected
          ? "bg-[#005000] text-white"
          : "text-[#253D4E] hover:bg-gray-50"
          }`}
        style={{ paddingLeft: `${1 + level}rem` }}
      >
        <span>{category.category}</span>
        {category.subCategories && category.subCategories.length > 0 && (
          <ChevronDown className={`w-4 h-4 ${isSelected ? "text-white" : "text-gray-400"}`} />
        )}
      </button>
      {category.subCategories && category.subCategories.length > 0 && (
        <ul className="mt-1 space-y-1">
          {category.subCategories.map(sub => (
            <CategoryItem
              key={sub.id}
              category={sub}
              handleCategoryChange={handleCategoryChange}
              selectedCategory={selectedCategory}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

interface FilterSidebarContentProps {
  categories: Category[];
  selectedCategory: string;
  handleCategoryChange: (id: string) => void;
  brands: Brand[];
  selectedBrand: string;
  handleBrandChange: (id: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  maxPrice: number;
  loading: boolean;
  onClearAll: () => void;
}

const FilterSidebarContent = ({
  categories,
  selectedCategory,
  handleCategoryChange,
  brands,
  selectedBrand,
  handleBrandChange,
  priceRange,
  setPriceRange,
  maxPrice,
  loading,
  onClearAll
}: FilterSidebarContentProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 lg:sticky lg:top-8">
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
          {categories
            .filter(cat => cat.level === 1)
            .map(cat => (
              <CategoryItem
                key={cat.id}
                category={cat}
                handleCategoryChange={handleCategoryChange}
                selectedCategory={selectedCategory}
              />
            ))}
        </ul>
      )}
    </div>

    <div>
      <h3 className="font-extrabold text-[#253D4E] text-lg mb-4">Filter by Brand</h3>
      <ul className="space-y-2 max-h-48 overflow-y-auto">
        <li>
          <button
            onClick={() => handleBrandChange("all")}
            className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-semibold ${selectedBrand === "all"
              ? "bg-[#005000] text-white"
              : "text-[#253D4E] hover:bg-gray-50"
              }`}
          >
            All Brands
          </button>
        </li>
        {brands.map((b) => (
          <li key={b.id}>
            <button
              onClick={() => handleBrandChange(String(b.id))}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all text-sm font-semibold ${selectedBrand === String(b.id)
                ? "bg-[#005000] text-white"
                : "text-[#253D4E] hover:bg-gray-50"
                }`}
            >
              {b.brand}
            </button>
          </li>
        ))}
      </ul>
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
          <span>AUD {priceRange[0]}</span>
          <span>AUD {priceRange[1]}</span>
        </div>
      </div>
    </div>

    <Button
      onClick={onClearAll}
      variant="outline"
      className="w-full border-[#005000] text-[#005000] hover:bg-[#005000] hover:text-white"
    >
      Clear All Filters
    </Button>
  </div>
);

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category");
  const initialBrand = searchParams.get("brand");
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [productOffers, setProductOffers] = useState<Map<number, Offer[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand || "all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState<string>(searchQuery || "");


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let productsData: Product[];

        // If search query exists, use search API
        if (searchQuery && searchQuery.trim()) {
          productsData = await productService.search(searchQuery.trim());
          setSearchTerm(searchQuery);
        } else {
          productsData = await productService.getAll();
          setSearchTerm("");
        }

        const [categoriesData, brandsData, offersData] = await Promise.all([
          categoryService.getActive(),
          brandService.getActive(),
          offerService.getAllOffers()
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData);
        setOffers(offersData);

        // Create a map of productId -> offers for efficient lookup
        const offersMap = new Map<number, Offer[]>();
        offersData.forEach((offer: any) => {
          const productId = offer.productId;
          if (productId) {
            if (!offersMap.has(productId)) {
              offersMap.set(productId, []);
            }
            offersMap.get(productId)!.push(offer);
          }
        });
        setProductOffers(offersMap);

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
  }, [searchQuery]);

  useEffect(() => {
    setSelectedCategory(initialCategory || "all");
  }, [initialCategory]);

  useEffect(() => {
    setSelectedBrand(initialBrand || "all");
  }, [initialBrand]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, sortBy]);

  const buildShopUrl = (category: string, brand: string) => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (brand !== "all") params.set("brand", brand);
    const q = params.toString();
    return q ? `/shop?${q}` : "/shop";
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    router.replace(buildShopUrl(categoryId, selectedBrand), { scroll: false });
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
    router.replace(buildShopUrl(selectedCategory, brandId), { scroll: false });
  };

  const handleClearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setPriceRange([0, maxPrice]);
    router.replace("/shop", { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => {
        const categoryObj = categories.find(c => String(c.id) === selectedCategory);
        if (categoryObj) {
          const allowedIds = getAllCategoryIds(categoryObj);
          return allowedIds.includes(p.productCategoryId);
        }
        return p.productCategoryId === Number(selectedCategory);
      });
    }

    // Apply brand filter
    if (selectedBrand !== "all") {
      filtered = filtered.filter((p) => p.brandId === Number(selectedBrand));
    }

    // Apply price filter
    filtered = filtered.filter(
      (p) => Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1]
    );

    // Sort products
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
  }, [products, selectedCategory, selectedBrand, sortBy, priceRange, searchQuery, categories]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);



  const maxPrice = products.length > 0 ? Math.max(...products.map(p => Number(p.price))) : 10000;

  const adaptProduct = (backendProduct: Product) => {
    const imgs = getProductImages(backendProduct);
    const primary = imgs.find(img => img.isPrimary) || imgs[0];
    const primaryImage = primary ? getProductImageUrl(primary) : '/images/products/placeholder.png';

    // Get offers for this product
    const productOffersArray = productOffers.get(backendProduct.id) || [];
    const offerInfo = calculateProductDiscount(Number(backendProduct.price), productOffersArray);

    // Construct Badges
    const badges: string[] = [];
    productOffersArray.forEach(o => {
      const now = new Date();
      if (o.isActive) {
        const start = new Date(o.startDate);
        const end = o.endDate ? new Date(o.endDate) : null;
        const hasStarted = isNaN(start.getTime()) || start <= now;
        const havenNotEnded = !end || isNaN(end.getTime()) || end >= now;

        if (hasStarted && havenNotEnded) {
          if (o.offerTypeId === 1) {
            const freeItem = o.freeProduct?.productName ? ` ${o.freeProduct.productName}` : '';
            badges.push(`Buy ${o.buyQuantity} Get ${o.getQuantity}${freeItem}`);
          } else if (o.offerTypeId === 4) {
            const gift = o.freeProduct?.productName || "Gift";
            if (o.buyQuantity && o.buyQuantity > 0) {
              badges.push(`Buy ${o.buyQuantity} Get ${o.getQuantity || 1} ${gift} Free`);
            } else {
              badges.push(`Free ${gift}`);
            }
          }
        }
      }
    });

    return {
      id: String(backendProduct.id),
      name: backendProduct.productName,
      category: backendProduct.product_category?.category || 'Uncategorized',
      price: offerInfo.discountedPrice,
      originalPrice: offerInfo.hasDiscount ? offerInfo.originalPrice : undefined,
      image: primaryImage,
      rating: 4,
      reviews: 45,
      description: backendProduct.description || '',
      stock: backendProduct.quantity,
      weight: backendProduct.product_category?.isWeightBased && backendProduct.weight
        ? `${backendProduct.weight}kg`
        : (backendProduct.weight ? `${backendProduct.weight}g` : '1kg'),
      brand: (backendProduct.brand as { brand?: string; brandName?: string } | undefined)?.brand ?? (backendProduct.brand as { brand?: string; brandName?: string } | undefined)?.brandName ?? '',
      offerValidity: offerInfo.offer ? formatOfferValidity(offerInfo.offer.endDate) : undefined,
      badges: badges
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop default header image */}
      <section className="w-full bg-white">
        <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="relative w-full aspect-[16/5] min-h-[180px] max-h-[360px] overflow-hidden rounded-none md:rounded-xl">
            <Image
              src="/images/headers/shop-header.png"
              alt="Shop header"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </section>

      {/* Search Results Header */}
      {searchQuery && (
        <div className="w-full bg-white border-b border-gray-200 py-4">
          <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#253D4E]">
                  Search Results for &quot;{searchQuery}&quot;
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  router.push("/shop");
                  setSearchTerm("");
                }}
                className="text-sm"
              >
                Clear Search
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded ${viewMode === "grid" ? "bg-[#005000] text-white" : "text-gray-600"}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded ${viewMode === "list" ? "bg-[#005000] text-white" : "text-gray-600"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden flex items-center gap-2 border-gray-200">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="h-full overflow-y-auto pb-20">
                  <FilterSidebarContent
                    categories={categories}
                    selectedCategory={selectedCategory}
                    handleCategoryChange={handleCategoryChange}
                    brands={brands}
                    selectedBrand={selectedBrand}
                    handleBrandChange={handleBrandChange}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    maxPrice={maxPrice}
                    loading={loading}
                    onClearAll={handleClearAllFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full md:w-auto flex-wrap">
            {searchQuery ? (
              <p className="text-xs sm:text-sm text-gray-600 order-first w-full sm:w-auto">
                Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-gray-600 order-first w-full sm:w-auto">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </p>
            )}
            <select
              className="min-h-[44px] sm:min-h-0 px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-200 rounded-lg bg-white text-xs sm:text-sm font-semibold text-[#253D4E] focus:outline-none focus:ring-2 focus:ring-[#005000] focus:border-transparent w-full sm:w-auto min-w-[140px]"
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              aria-label="Filter by brand"
            >
              <option value="all">Brand: All</option>
              {brands.map((b) => (
                <option key={b.id} value={String(b.id)}>{b.brand}</option>
              ))}
            </select>
            <select
              className="w-full sm:w-auto min-h-[44px] sm:min-h-0 px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-200 rounded-lg bg-white text-xs sm:text-sm font-semibold text-[#253D4E] focus:outline-none focus:ring-2 focus:ring-[#005000] focus:border-transparent min-w-[160px]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <aside className="hidden lg:block lg:w-[20%] lg:min-w-[250px]">
            <FilterSidebarContent
              categories={categories}
              selectedCategory={selectedCategory}
              handleCategoryChange={handleCategoryChange}
              brands={brands}
              selectedBrand={selectedBrand}
              handleBrandChange={handleBrandChange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxPrice}
              loading={loading}
              onClearAll={handleClearAllFilters}
            />
          </aside>

          <main className="flex-1 lg:w-[80%]">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-[#005000] mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold">Loading products...</p>
                </div>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <div className={`grid gap-2 sm:gap-3 md:gap-6 ${viewMode === "grid"
                  ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
                  }`}>
                  {paginatedProducts.map(product => (
                    viewMode === "list" ? (
                      <ProductListCard key={product.id} product={adaptProduct(product)} />
                    ) : (
                      <ProductCard key={product.id} product={adaptProduct(product)} />
                    )
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-wrap justify-center items-center gap-2 mt-8 sm:mt-12">
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
              <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-12 text-center">
                <p className="text-base sm:text-lg font-semibold text-gray-600 mb-2">No products found</p>
                <p className="text-xs sm:text-sm text-gray-500">Try adjusting your filters</p>
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
