"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Product } from "@/lib/data";
import productService, { getProductImages, getProductImageUrl } from "@/services/product.service";
import type { Product as ApiProduct } from "@/services/product.service";
import { ProductCard } from "@/components/product-card";

const POPULAR_LIMIT = 10;
const PLACEHOLDER_IMAGE = "/images/products/placeholder.png";

/** Adapt API product to lib/data Product (no offers - for home Popular Products) */
function adaptProduct(backendProduct: ApiProduct): Product {
    const imgs = getProductImages(backendProduct);
    const primary = imgs.find((img) => img.isPrimary) || imgs[0];
    const primaryImage = primary ? getProductImageUrl(primary) : PLACEHOLDER_IMAGE;

    const weight = backendProduct.product_category?.isWeightBased && backendProduct.weight
        ? `${backendProduct.weight}kg`
        : backendProduct.weight
            ? `${backendProduct.weight}g`
            : "1kg";

    return {
        id: String(backendProduct.id),
        name: backendProduct.productName,
        category: (backendProduct.product_category as { category?: string })?.category || "Uncategorized",
        price: Number(backendProduct.price),
        image: primaryImage,
        description: backendProduct.description || "",
        weight,
        rating: 4,
        reviews: 0,
        brand: (backendProduct.brand as { brand?: string; brandName?: string } | undefined)?.brand
            ?? (backendProduct.brand as { brand?: string; brandName?: string } | undefined)?.brandName
            ?? "",
    };
}

export default function PopularProducts() {
    const [products, setProducts] = useState<ApiProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        productService
            .getAll()
            .then((data) => setProducts(Array.isArray(data) ? data.slice(0, POPULAR_LIMIT) : []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
                <div className="flex items-center justify-between mb-10 md:mb-12">
                    <h2 className="text-4xl font-extrabold text-[#253D4E]">Popular Products</h2>
                </div>
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-10 h-10 animate-spin text-[#005000]" />
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
            {/* Header - same as Featured Categories */}
            <div className="flex items-center justify-between mb-10 md:mb-12">
                <h2 className="text-4xl font-extrabold text-[#253D4E]">Popular Products</h2>

                <Link
                    href="/shop"
                    className="shrink-0 px-5 py-2.5 rounded-lg bg-[#005000] hover:bg-[#006600] text-white text-sm font-semibold transition-colors"
                >
                    View More
                </Link>
            </div>

            {/* Shop page product cards - horizontal scroll */}
            <div
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {products.map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-[270px] min-w-[270px]">
                        <ProductCard product={adaptProduct(product)} />
                    </div>
                ))}
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
