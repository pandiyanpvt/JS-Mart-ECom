"use client";

import { useEffect, useState } from "react";
import ShopGridSection from "@/components/sections/shop-grid-section";
import categoryService from "@/services/category.service";
import { Loader2 } from "lucide-react";

const DEFAULT_CATEGORY_IMG = "/images/category-section/vegetables.jpg";

export default function CategorySection() {
  const [items, setItems] = useState<{ id: number; name: string; image: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getActive()
      .then((categories) =>
        setItems(
          categories.map((c) => ({
            id: c.id,
            name: c.category,
            image: c.categoryImg || DEFAULT_CATEGORY_IMG,
          }))
        )
      )
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="pt-8 sm:pt-24 xl:mx-auto xl:max-w-7xl xl:px-8 w-full px-4">
        <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
        <div className="mt-6 flex justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-[#005000]" />
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <ShopGridSection
      title="Shop by Category"
      items={items}
      linkPrefix="/shop?category="
      gridCols="grid-cols-4 sm:grid-cols-7"
      imageSize="w-20 h-20 sm:w-24 sm:h-24"
      showViewMore
      initialCount={14}
    />
  );
}
