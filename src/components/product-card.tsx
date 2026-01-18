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
        <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between">

            {/* Clickable area for viewing product */}
            <Link href={`/shop/${product.id}`} className="cursor-pointer">
                <div>
                    <div className="relative h-48 flex items-center justify-center bg-gray-50/50 p-4">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-2"
                        />
                    </div>
                    <h3 className="mt-2 text-sm font-medium">{product.name}</h3>
                    <div className="text-sm font-semibold mt-1">Rs. {product.price.toFixed(2)}</div>
                </div>
            </Link>

            {/* ADD to cart button outside the Link */}
            <Button
                variant="outline"
                className="w-full border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-white mt-2"
                onClick={() => addToCart(product)}
            >
                ADD
            </Button>
        </div>
    );
}
