"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/data";
import { Star, Plus } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Big Onion",
    image: "/images/veg/onion.jpg",
    weight: "500 g",
    price: "Rs. 150.00",
    tag: "BIG ONION",
  },
  {
    id: 2,
    name: "Broccoli",
    image: "/images/veg/broccoli.jpg",
    weight: "300 g",
    price: "Rs. 1149.00",
    tag: "BROCCOLI",
  },
  {
    id: 3,
    name: "Butter Beans",
    image: "/images/veg/beans.jpg",
    weight: "250 g",
    price: "Rs. 352.50",
    tag: "BUTTER BEANS",
  },
  {
    id: 4,
    name: "Capsicum",
    image: "/images/veg/capsicum.jpg",
    weight: "250 g",
    price: "Rs. 287.00",
    tag: "CAPSICUM",
  },
  {
    id: 5,
    name: "Carrot",
    image: "/images/veg/carrot.jpg",
    weight: "500 g",
    price: "Rs. 354.00",
    tag: "CARROT",
  },
];

export default function BestOfFruitVeg() {
  return (
    <section className="px-4 md:px-8 py-8">
      {/* className="min-w-[220px] bg-white rounded-lg border shadow-sm hover:shadow-md transition p-10" */}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Best Of Fruit & Veg</h2>
        <Link href="/shop">
          <span className="text-red-500 text-sm font-medium cursor-pointer">
            View more
          </span>
        </Link>
      </div>

      {/* Cards */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[220px] bg-white rounded-lg border shadow-sm hover:shadow-md transition"
          >
            {/* Image */}
            <div className="relative h-40 flex items-center justify-center">
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                className="object-contain"
              />

              {/* Vertical tag */}
              <div className="absolute right-2 top-2 flex flex-col items-center">
                <span className="bg-green-500 text-white text-[10px] px-2 py-1 rotate-90 origin-bottom">
                  {product.tag}
                </span>
                <span className="bg-yellow-400 text-black text-[10px] px-2 mt-1 rotate-90 origin-bottom">
                  {product.weight}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 border border-green-500 flex items-center justify-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full" />
                </span>
                <h3 className="font-medium text-sm">{product.name}</h3>
              </div>

              <div className="bg-gray-100 text-sm px-3 py-1 rounded">
                {product.weight}
              </div>

              <div className="text-sm font-semibold">{product.price}</div>
              <p className="text-xs text-gray-500">
                (Inclusive of all taxes)
              </p>

              <Button
                variant="outline"
                className="w-full border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-white"
              >
                ADD
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Shared Components for Shop Page ---

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md dark:bg-zinc-950 dark:border-zinc-800">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {product.badges?.map((badge, index) => {
          let bgClass = "bg-primary text-primary-foreground";
          if (badge === "Best Sale") bgClass = "bg-red-600 text-white";
          else if (badge === "Frozen") bgClass = "bg-yellow-400 text-black";
          else if (badge.includes("OFF")) bgClass = "bg-orange-500 text-white";
          else if (badge === "Organic") bgClass = "bg-green-500 text-white";

          return (
            <span key={index} className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${bgClass}`}>
              {badge}
            </span>
          )
        })}
      </div>

      <div className="relative aspect-square overflow-hidden bg-gray-50/50 dark:bg-zinc-900/50 p-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-base leading-snug text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[2.5rem] mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.weight}</p>

        <div className="flex items-center gap-1 mb-4">
          <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">({product.rating}/{product.reviews})</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-900 dark:text-gray-50">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Button size="icon" className="h-9 w-9 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm shrink-0">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
