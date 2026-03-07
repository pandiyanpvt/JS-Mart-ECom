"use client";

import Image from "next/image";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Eye, Star } from "lucide-react";

interface ProductCardProps {
    product: Product;
    /** Compact layout for mobile horizontal scroll (smaller image, padding, text) */
    compact?: boolean;
}

export function ProductCard({ product, compact }: ProductCardProps) {
    const router = useRouter();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const inWishlist = isInWishlist(product.id);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const renderStars = (rating: number = 4) => {
        const starClass = compact ? "w-3 h-3" : "w-4 h-4";
        return (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`${starClass} ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                            }`}
                    />
                ))}
            </div>
        );
    };

    // Calculate discount percentage if there's an original price
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const displayPrice = product.price;

    const handleCardClick = () => {
        router.push(`/shop/${product.id}`);
    };

    return (
        <div className="group w-full cursor-pointer" onClick={handleCardClick}>
            <div className="bg-white border border-gray-200 transition-all duration-300 hover:shadow-xl relative overflow-hidden h-full">
                {/* Top Section with Image and Icons */}
                <div className={`relative bg-gray-50 ${compact ? "p-2" : "p-4"}`}>
                    {/* Discount Badge */}
                    {/* Badges Container */}
                    <div className={`absolute z-10 flex flex-col items-start gap-1 max-w-[75%] pointer-events-none ${compact ? "top-1.5 left-1.5" : "top-3 left-3"}`}>
                        {/* Discount Badge */}
                        {discount > 0 && (
                            <span className="bg-[#FF4858] text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded shadow-sm whitespace-nowrap">
                                -{discount}%
                            </span>
                        )}
                        {/* Custom Badges */}
                        {product.badges && product.badges.map((badge, index) => (
                            <span key={index} className="bg-[#005000] text-white text-[10px] md:text-xs font-bold px-2 py-1 shadow-sm text-left leading-tight">
                                {badge}
                            </span>
                        ))}
                    </div>

                    {/* Action Icons */}
                    <div className={`absolute z-10 flex flex-col gap-1.5 ${compact ? "top-1.5 right-1.5" : "top-3 right-3"}`}>
                        <button
                            onClick={handleWishlistToggle}
                            className={`rounded-full flex items-center justify-center shadow-md transition-all group/icon touch-manipulation ${compact ? "min-w-[44px] min-h-[44px] w-9 h-9" : "w-9 h-9"} ${inWishlist
                                ? "bg-[#005000] text-white"
                                : "bg-white hover:bg-[#005000] hover:text-white"
                                }`}
                            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart className={`${compact ? "w-3.5 h-3.5" : "w-4 h-4"} ${inWishlist ? "fill-white text-white" : "text-gray-700 group-hover/icon:text-white"}`} />
                        </button>
                        <Link href={`/shop/${product.id}`} onClick={(e) => e.stopPropagation()} className={compact ? "min-w-[44px] min-h-[44px] flex items-center justify-center" : ""}>
                            <button type="button" className={`bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#005000] hover:text-white transition-all group/icon touch-manipulation ${compact ? "min-w-[44px] min-h-[44px] w-9 h-9" : "w-9 h-9"}`} aria-label="View product">
                                <Eye className={`${compact ? "w-3.5 h-3.5" : "w-4 h-4"} text-gray-700 group-hover/icon:text-white`} />
                            </button>
                        </Link>
                    </div>

                    {/* Product Image */}
                    <div className={`relative w-full flex items-center justify-center ${compact ? "h-[90px]" : "h-[140px] md:h-[180px]"}`}>
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* Product Info - productName, brand, price */}
                <div className={compact ? "p-2 space-y-0.5" : "p-3 md:p-4 space-y-1 md:space-y-2"}>
                    <h3 className={`text-[#253D4E] font-semibold leading-tight hover:text-[#005000] transition-colors line-clamp-2 ${compact ? "text-[11px]" : "text-xs md:text-sm"}`}>
                        {product.name}
                    </h3>

                    {product.brand && !compact && (
                        <p className="text-gray-500 text-xs font-medium">
                            {product.brand}
                        </p>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <span className={`text-[#FF4858] font-bold ${compact ? "text-xs" : "text-base md:text-xl"}`}>
                            AUD {displayPrice.toFixed(0)}
                        </span>
                        {product.originalPrice && !compact && (
                            <span className="text-gray-400 text-sm line-through font-medium">
                                AUD {product.originalPrice.toFixed(0)}
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    {!compact && (
                    <div className="flex items-center gap-2">
                        {renderStars(4)}
                        <span className="text-gray-500 text-sm">(45)</span>
                    </div>
                    )}

                    {/* Offer Validity */}
                    {product.offerValidity && (
                        <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {product.offerValidity}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}