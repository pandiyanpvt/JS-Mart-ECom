"use client";

import Image from "next/image";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Eye, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductListCardProps {
    product: Product;
}

export function ProductListCard({ product }: ProductListCardProps) {
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

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    const renderStars = (rating: number = 4) => {
        return (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
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
            <div className="bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-3 p-3">
                    {/* Left Side - Product Image */}
                    <div className="relative bg-gray-50 rounded-lg p-3 sm:w-48 flex-shrink-0">
                        {/* Discount Badge */}
                        {discount > 0 && (
                            <div className="absolute top-2 left-2 z-10">
                                <span className="bg-[#FF4858] text-white text-xs font-bold px-2 py-0.5 rounded">
                                    -{discount}%
                                </span>
                            </div>
                        )}
                        {/* Custom Badges */}
                        {product.badges && product.badges.length > 0 && (
                            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 mt-6">
                                {product.badges.map((badge, index) => (
                                    <span key={index} className="bg-[#005000] text-white text-xs font-bold px-2 py-0.5 rounded w-fit">
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Product Image */}
                        <div className="relative w-full h-[140px] flex items-center justify-center">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                    </div>

                    {/* Right Side - Product Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="space-y-2">
                            {/* Category */}
                            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                                {product.category}
                            </p>

                            {/* Product Name */}
                            <h3 className="text-[#253D4E] font-bold text-lg leading-tight hover:text-[#005000] transition-colors line-clamp-1">
                                {product.name}
                            </h3>

                            {/* Brand */}
                            {product.brand && (
                                <p className="text-gray-600 text-xs font-medium">
                                    Brand: <span className="text-[#253D4E] font-semibold">{product.brand}</span>
                                </p>
                            )}

                            {/* Description */}
                            {product.description && (
                                <p className="text-gray-600 text-xs line-clamp-1">
                                    {product.description}
                                </p>
                            )}

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                {renderStars(4)}
                                <span className="text-gray-500 text-xs">(45 reviews)</span>
                            </div>

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

                        {/* Bottom Section - Price and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3 pt-3 border-t border-gray-100">
                            {/* Price */}
                            <div className="flex items-center gap-3">
                                <span className="text-[#FF4858] font-bold text-xl">
                                    AUD {displayPrice.toFixed(0)}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-gray-400 text-base line-through font-medium">
                                        AUD {product.originalPrice.toFixed(0)}
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleWishlistToggle}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${inWishlist
                                        ? "bg-[#005000] text-white"
                                        : "bg-white border border-gray-200 hover:bg-[#005000] hover:text-white"
                                        }`}
                                    title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                    <Heart className={`w-5 h-5 ${inWishlist ? "fill-white text-white" : ""}`} />
                                </button>
                                <Link href={`/shop/${product.id}`} onClick={(e) => e.stopPropagation()}>
                                    <button type="button" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:bg-[#005000] hover:text-white transition-all">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </Link>
                                <Button
                                    onClick={handleAddToCart}
                                    className="bg-[#005000] hover:bg-[#006600] text-white px-6 h-10"
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
