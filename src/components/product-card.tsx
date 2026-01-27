"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    return (
        <div className="flex gap-6 border rounded-xl p-4 bg-white hover:shadow-sm transition">

            {/* IMAGE */}
            <Link
                href={`/shop/${product.id}`}
                className="relative w-40 h-40 shrink-0 bg-gray-50 rounded-md"
            >
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
            </Link>

            {/* INFO */}
            <div className="flex-1 flex flex-col justify-between">

                <Link href={`/shop/${product.id}`}>
                    <h3 className="font-semibold text-sm hover:underline">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating (mock) */}
                <div className="text-yellow-500 text-sm">★★★★★</div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                    {product.description}
                </p>
            </div>

            {/* PRICE + ACTION */}
            <div className="w-44 flex flex-col items-end justify-between">

                <p className="text-lg font-bold">
                    Rs. {product.price.toFixed(2)}
                </p>

                <Button
                    variant="outline"
                    className="border-lime-500 text-lime-600 hover:bg-lime-500 hover:text-white"
                    onClick={() => addToCart(product)}
                >
                    Add to Cart
                </Button>
            </div>

        </div>
    );
}