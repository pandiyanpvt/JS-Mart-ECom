"use client";

import { useParams } from "next/navigation"; // <- App Router hook
import {products} from "@/lib/data";
import Image from "next/image";
import {Button} from "@/components/ui/button";

export default function ProductDetailsPage() {
    const params = useParams(); // get route params
    const {id} = params;

    const product = products.find((p) => p.id === id);
    console.log(product)
    if (!product) return <p>Product not found!</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="relative w-full h-96 md:h-[500px]">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-xl font-semibold text-emerald-700">${product.price.toFixed(2)}</p>
                    {product.originalPrice && (
                        <p className="line-through text-gray-400">${product.originalPrice.toFixed(2)}</p>
                    )}
                    <p className="text-gray-700">{product.description}</p>
                    <p className="text-gray-500">Weight: {product.weight}</p>
                    <p className="text-gray-500">Rating: {product.rating} ({product.reviews} reviews)</p>

                    {/* Quantity + Add to Cart */}
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            min={1}
                            defaultValue={1}
                            className="w-16 border rounded px-2 py-1"
                        />
                        <Button>Add to Cart</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
