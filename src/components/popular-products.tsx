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
            <section className="w-full py-10 md:py-12 bg-gray-50">
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-10 md:mb-12">
                        <h2 className="text-2xl font-extrabold text-[#253D4E]">Popular Products</h2>
                    </div>
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-10 h-10 animate-spin text-[#005000]" />
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="w-full py-6 md:py-12 bg-gray-50">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                {/* Header - same as Featured Categories */}
                <div className="flex items-center justify-between gap-3 mb-6 md:mb-12">
                    <h2 className="text-lg md:text-2xl font-extrabold text-[#253D4E] leading-tight">Popular Products</h2>
                    <Link
                        href="/shop"
                        className="shrink-0 px-3 py-2 md:px-5 md:py-3 md:min-h-[44px] flex items-center bg-[#005000] hover:bg-[#006600] text-white text-xs md:text-sm font-semibold transition-colors touch-manipulation rounded"
                    >
                        View More
                    </Link>
                </div>

                {/* Desktop: 3–5 columns */}
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={adaptProduct(product)} />
                    ))}
                </div>

                {/* Mobile: 2-column grid, compact cards, touch-friendly */}
                <div className="grid grid-cols-2 md:hidden gap-2 sm:gap-3">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={adaptProduct(product)} compact />
                    ))}
                </div>
            </div>
        </section>
    );
}
