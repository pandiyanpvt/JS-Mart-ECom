"use client";

import Link from "next/link";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";

export default function BestOfFruitVeg() {
    const featuredProducts = products.slice(0, 5);

    return (
        <section className="px-4 md:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Best Of Fruit & Veg</h2>
                <Link href="/shop" className="text-red-500 text-sm font-medium">
                    View more
                </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4">
                {featuredProducts.map((product) => (
                    <div key={product.id} className="min-w-[220px]">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}
