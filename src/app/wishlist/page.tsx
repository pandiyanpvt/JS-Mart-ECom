"use client";

import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (product: any) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            weight: product.weight,
            tag: product.tag,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
                    <Heart className="w-8 h-8 md:w-10 md:h-10 text-red-500 fill-red-500" />
                    My Wishlist
                </h1>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-12">
                {wishlist.length === 0 ? (
                    // Empty State
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 md:p-16 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                <Heart className="w-12 h-12 text-gray-400" />
                            </div>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#253D4E] mb-4">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Start adding products to your wishlist by clicking the heart icon on any product card.
                        </p>
                        <Link href="/shop">
                            <Button className="bg-[#005000] hover:bg-[#006600] text-white px-8 py-6 text-lg font-semibold">
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Header Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-[#253D4E]">
                                    {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"} in Wishlist
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    Save your favorite products for later
                                </p>
                            </div>
                            <Button
                                onClick={clearWishlist}
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear All
                            </Button>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlist.map((product) => (
                                <div key={product.id} className="relative">
                                    <ProductCard product={product} />
                                    <div className="mt-2 flex gap-2">
                                        <Button
                                            onClick={() => handleAddToCart(product)}
                                            className="flex-1 bg-[#005000] hover:bg-[#006600] text-white text-sm font-semibold"
                                        >
                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                            Add to Cart
                                        </Button>
                                        <Button
                                            onClick={() => removeFromWishlist(product.id)}
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                            title="Remove from wishlist"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Continue Shopping */}
                        <div className="mt-12 text-center">
                            <Link href="/shop">
                                <Button variant="outline" className="px-8 py-6 text-lg font-semibold">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
