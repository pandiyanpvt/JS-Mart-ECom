"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import productService from "@/services/product.service";
import type { Product as BackendProduct } from "@/services/product.service";
import { getProductImages, getProductImageUrl } from "@/services/product.service";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, ChevronDown, ChevronUp, Percent, Package, Clock, MapPin, Loader2, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { Product as LibProduct } from "@/lib/data";

function adaptToLibProduct(p: BackendProduct): LibProduct {
    const imgs = getProductImages(p);
    const primary = imgs.find((img) => img.isPrimary) || imgs[0];
    const primaryImage = primary ? getProductImageUrl(primary) : "/images/products/placeholder.png";
    return {
        id: String(p.id),
        name: p.productName,
        category: p.product_category?.category || "Uncategorized",
        price: Number(p.price),
        originalPrice: undefined,
        image: primaryImage,
        description: p.description || "",
        weight: p.weight ? `${p.weight}g` : "—",
        rating: 4,
        reviews: 45,
        brand: (p.brand as { brandName?: string })?.brandName ?? "",
    };
}

export default function ProductViewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState<BackendProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [openShipping, setOpenShipping] = useState(true);

    const maxQty = product ? Math.max(1, product.quantity ?? 99) : 99;

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        setLoading(true);
        productService
            .getById(Number(id))
            .then((data) => {
                if (!cancelled) {
                    setProduct(data);
                    const stock = data.quantity ?? 99;
                    setQuantity((q) => Math.min(Math.max(1, q), Math.max(1, stock)));
                }
            })
            .catch(() => {
                if (!cancelled) setProduct(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(() => {
        if (!product) return;
        const stock = Math.max(1, product.quantity ?? 99);
        setQuantity((q) => Math.min(Math.max(1, q), stock));
    }, [product?.quantity]);

    const setQuantityClamped = (value: number) => {
        const n = Math.floor(Number(value));
        if (Number.isNaN(n) || n < 1) setQuantity(1);
        else setQuantity(Math.min(n, maxQty));
    };

    const handleAddToCart = () => {
        if (!product) return;
        const lib = adaptToLibProduct(product);
        addToCart(lib, quantity);
        toast.success("Added to cart");
    };

    const handleBuyNow = () => {
        if (!product) return;
        const lib = adaptToLibProduct(product);
        addToCart(lib, quantity);
        router.push("/checkout");
    };

    const handleWishlistToggle = () => {
        if (!product) return;
        const lib = adaptToLibProduct(product);
        if (isInWishlist(lib.id)) removeFromWishlist(lib.id);
        else addToWishlist(lib);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-[100px] pb-12 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#005000] mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 pt-[100px] pb-12 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-bold text-[#253D4E] mb-4">Product not found</p>
                    <Link href="/shop">
                        <Button className="bg-[#005000] hover:bg-[#006600] text-white rounded-lg">Back to Shop</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const categoryName = product.product_category?.category || "Uncategorized";
    const imgs = getProductImages(product);
    const primaryImg = imgs.find((img) => img.isPrimary) || imgs[0];
    const primaryImage = primaryImg ? getProductImageUrl(primaryImg) : "/images/products/placeholder.png";
    const allImages = imgs.length ? imgs.map((img) => getProductImageUrl(img)) : [primaryImage];
    const price = Number(product.price);
    const libProduct = adaptToLibProduct(product);
    const inWishlist = isInWishlist(libProduct.id);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 pt-[100px]">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
                        {/* Left: Image gallery */}
                        <div className="space-y-4">
                            <div className="relative w-full aspect-square max-h-[500px] bg-gray-50 rounded-xl overflow-hidden">
                                <Image
                                    src={allImages[selectedImage] || primaryImage}
                                    alt={product.productName}
                                    fill
                                    className="object-contain"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                            {allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {allImages.map((url, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setSelectedImage(i)}
                                            className={`relative w-20 h-20 flex-shrink-0 rounded-lg border-2 overflow-hidden transition-colors ${
                                                selectedImage === i ? "border-[#005000]" : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <Image src={url} alt="" fill className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Details from backend */}
                        <div className="space-y-6">
                            <div className="space-y-6">
                                <span className="inline-block px-4 py-1.5 bg-gray-100 text-[#253D4E] font-semibold text-sm rounded-full">
                                    {categoryName}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-bold text-[#253D4E] leading-tight">
                                    {product.productName}
                                </h1>
                                {product.description && (
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {product.description}
                                    </p>
                                )}
                                {product.brand && (
                                    <p className="text-sm font-semibold text-gray-600">
                                        Brand: {(product.brand as { brandName?: string })?.brandName ?? "—"}
                                    </p>
                                )}
                                <p className="text-2xl font-bold text-[#253D4E]">Rs. {price.toFixed(2)}</p>
                            </div>

                            {/* Quantity */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#253D4E]">Quantity</label>
                                <div className="inline-flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setQuantityClamped(quantity - 1)}
                                        disabled={quantity <= 1}
                                        className="h-12 w-12 flex items-center justify-center text-[#253D4E] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="number"
                                        min={1}
                                        max={maxQty}
                                        value={quantity}
                                        onChange={(e) => setQuantityClamped(Number(e.target.value))}
                                        className="w-14 h-12 text-center font-bold text-[#253D4E] bg-transparent border-0 border-x border-gray-200 focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setQuantityClamped(quantity + 1)}
                                        disabled={quantity >= maxQty}
                                        className="h-12 w-12 flex items-center justify-center text-[#253D4E] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                {maxQty < 99 && (
                                    <p className="text-xs text-gray-500">Max {maxQty} available</p>
                                )}
                            </div>

                            {/* Actions: Add to Cart, Buy Now, Wishlist */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={Number(product.quantity) === 0}
                                    variant="outline"
                                    className="flex-1 h-12 border-2 border-[#005000] text-[#005000] hover:bg-[#005000] hover:text-white font-bold rounded-xl disabled:opacity-60 transition-colors"
                                >
                                    Add to Cart
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleBuyNow}
                                    disabled={Number(product.quantity) === 0}
                                    className="flex-1 h-12 bg-[#005000] hover:bg-[#006600] text-white font-bold rounded-xl disabled:opacity-60 transition-colors"
                                >
                                    Buy Now
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleWishlistToggle}
                                    className={`h-12 w-12 rounded-xl border-2 flex-shrink-0 flex items-center justify-center ${
                                        inWishlist ? "bg-[#005000] border-[#005000] text-white" : "border-gray-200 hover:border-[#005000] hover:text-[#005000]"
                                    }`}
                                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                    <Heart className={`w-5 h-5 ${inWishlist ? "fill-white" : ""}`} />
                                </Button>
                            </div>

                            {/* Shipping */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setOpenShipping(!openShipping)}
                                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                                >
                                    <span className="font-bold text-[#253D4E]">Shipping</span>
                                    {openShipping ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                                {openShipping && (
                                    <div className="p-4 border-t border-gray-100 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-full bg-[#253D4E] flex items-center justify-center text-white">
                                                <Percent className="w-5 h-5" />
                                            </span>
                                            <div>
                                                <p className="font-semibold text-[#253D4E] text-sm">Discount</p>
                                                <p className="text-gray-600 text-sm">Disc 50%</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-full bg-[#253D4E] flex items-center justify-center text-white">
                                                <Package className="w-5 h-5" />
                                            </span>
                                            <div>
                                                <p className="font-semibold text-[#253D4E] text-sm">Package</p>
                                                <p className="text-gray-600 text-sm">Regular Package</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-full bg-[#253D4E] flex items-center justify-center text-white">
                                                <Clock className="w-5 h-5" />
                                            </span>
                                            <div>
                                                <p className="font-semibold text-[#253D4E] text-sm">Delivery Time</p>
                                                <p className="text-gray-600 text-sm">3-4 Working Days</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-full bg-[#253D4E] flex items-center justify-center text-white">
                                                <MapPin className="w-5 h-5" />
                                            </span>
                                            <div>
                                                <p className="font-semibold text-[#253D4E] text-sm">Estimation Arrive</p>
                                                <p className="text-gray-600 text-sm">10-12 October 2024</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
