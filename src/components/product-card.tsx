
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/data";
import { Star, Plus } from "lucide-react";

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
