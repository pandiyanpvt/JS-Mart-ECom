"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import productService from "@/services/product.service";
import type { Product as BackendProduct } from "@/services/product.service";
import { getProductImages, getProductImageUrl } from "@/services/product.service";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, ChevronDown, ChevronUp, Percent, Package, Clock, MapPin, Loader2, Minus, Plus, Gift, Tag, ChevronRight, Home, Crown, Zap, Gem, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import type { Product as LibProduct } from "@/lib/data";
import { offerService } from "@/services/offer.service";
import { calculateProductDiscount, formatOfferValidity, type Offer } from "@/utils/offerUtils";
import { ProductCard } from "@/components/product-card";
import { ProductReviews } from "./_components/ProductReviews";
import { membershipService, UserSubscription } from "@/services/membership.service";
import { cn } from "@/lib/utils";

function adaptToLibProduct(p: BackendProduct): LibProduct {
    const imgs = getProductImages(p);
    const primary = imgs.find((img) => img.isPrimary) || imgs[0];
    const primaryImage = getProductImageUrl(primary);
    return {
        id: String(p.id),
        name: p.productName,
        category: p.product_category?.category || "Uncategorized",
        price: Number(p.price),
        originalPrice: undefined,
        image: primaryImage,
        description: p.description || "",
        weight: "Per unit",
        rating: 4,
        reviews: 45,
        brand: p.brand?.brand ?? p.brand?.brandName ?? "",
        isReturnable: p.isReturnable,
    };
}

export default function ProductViewPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const id = params.id;
    const router = useRouter();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState<BackendProduct | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<BackendProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRelated, setLoadingRelated] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [openShipping, setOpenShipping] = useState(true);
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);

    const maxQty = product ? Math.max(1, product.quantity ?? 99) : 99;

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        setLoading(true);

        Promise.all([
            productService.getById(Number(id)),
            offerService.getOffersByProduct(Number(id)),
            membershipService.getMySubscription()
        ])
            .then(([productData, offersData, subData]) => {
                if (!cancelled) {
                    setProduct(productData);
                    setSubscription(subData);
                    setOffers(offersData || []);

                    const stock = productData.quantity || 99;
                    setQuantity((q) => Math.min(Math.max(1, q), Math.max(1, stock)));

                    // Fetch related products from same category
                    if (productData.productCategoryId) {
                        setLoadingRelated(true);
                        productService.getByCategory(productData.productCategoryId)
                            .then((related) => {
                                // Filter out current product and limit to 4
                                const filtered = related
                                    .filter(p => p.id !== productData.id)
                                    .slice(0, 4);
                                setRelatedProducts(filtered);
                            })
                            .catch(() => setRelatedProducts([]))
                            .finally(() => setLoadingRelated(false));
                    }
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setProduct(null);
                    setOffers([]);
                }
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
        router.push(`/checkout?productId=${product.id}&qty=${quantity}`);
    };

    const handleWishlistToggle = () => {
        if (!product) return;
        const lib = adaptToLibProduct(product);
        if (isInWishlist(lib.id)) removeFromWishlist(lib.id);
        else addToWishlist(lib);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-0 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#005000] mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 pt-0 pb-12 flex items-center justify-center">
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
    const primaryImage = getProductImageUrl(primaryImg);
    const allImages = imgs.length ? imgs.map((img) => getProductImageUrl(img)) : [primaryImage];
    const price = Number(product.price);
    const libProduct = adaptToLibProduct(product);
    const inWishlist = isInWishlist(libProduct.id);

    return (
        <div className="min-h-screen bg-gray-50 pb-4 md:pb-8">
            {/* Breadcrumbs */}
            <div className="w-full pt-0 pb-2 md:pb-4">
                <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-[#005000] transition-colors flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/shop" className="hover:text-[#005000] transition-colors">
                            Shop
                        </Link>
                        {categoryName && (
                            <>
                                <ChevronRight className="w-4 h-4" />
                                <Link
                                    href={`/shop?category=${product.productCategoryId}`}
                                    className="hover:text-[#005000] transition-colors"
                                >
                                    {categoryName}
                                </Link>
                            </>
                        )}
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#253D4E] font-semibold truncate max-w-[200px]">
                            {product.productName}
                        </span>
                    </nav>
                </div>
            </div>

            <div className="w-full py-4 md:py-6">
                <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
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
                                                className={`relative w-20 h-20 flex-shrink-0 rounded-lg border-2 overflow-hidden transition-colors ${selectedImage === i ? "border-[#005000]" : "border-gray-200 hover:border-gray-300"
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
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="inline-block px-4 py-1.5 bg-gray-100 text-[#253D4E] font-semibold text-sm rounded-full mb-4">
                                                {categoryName}
                                            </span>
                                            <h1 className="text-3xl md:text-4xl font-bold text-[#253D4E] leading-tight">
                                                {product.productName}
                                            </h1>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleWishlistToggle}
                                            className={`p-3 rounded-full transition-colors ${inWishlist ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-400 hover:text-red-500"
                                                }`}
                                            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                        >
                                            <Heart className={`w-6 h-6 ${inWishlist ? "fill-current" : ""}`} />
                                        </button>
                                    </div>
                                    {product.description && (
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {product.description}
                                        </p>
                                    )}
                                    {product.brand && (
                                        <p className="text-sm font-semibold text-gray-600">
                                            Brand: {product.brand?.brand ?? product.brand?.brandName ?? "—"}
                                        </p>
                                    )}
                                    {(product.isReturnable == 0 || product.isReturnable === false) && (
                                        <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 w-fit">
                                            <RotateCcw className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wide">Non-returnable</span>
                                        </div>
                                    )}

                                    {/* Price with Offer */}
                                    {(() => {
                                        const userLevel = subscription?.plan?.level || 0;
                                        const offerInfo = calculateProductDiscount(price, offers, userLevel);
                                        const otherOffers = offers.filter(offer => {
                                            if (!offer.isActive) return false;
                                            const now = new Date();
                                            const start = new Date(offer.startDate);
                                            const end = offer.endDate ? new Date(offer.endDate) : null;
                                            const hasStarted = isNaN(start.getTime()) || start <= now;
                                            const hasnNotEnded = !end || isNaN(end.getTime()) || end >= now;
                                            return hasStarted && hasnNotEnded;
                                        });

                                        return (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <p className="text-3xl font-bold text-[#005000]">
                                                        AUD {offerInfo.discountedPrice.toFixed(2)}
                                                    </p>
                                                    {offerInfo.hasDiscount && (
                                                        <>
                                                            <p className="text-xl font-medium text-gray-400 line-through">
                                                                AUD {offerInfo.originalPrice.toFixed(2)}
                                                            </p>
                                                            {offerInfo.offer && offerInfo.offer.offerTypeId === 2 && (
                                                                <div className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded-lg ml-2">
                                                                    <Tag className="w-3 h-3 text-red-600" />
                                                                    <span className="text-xs font-bold text-red-700">
                                                                        {offerInfo.discountPercentage
                                                                            ? `${offerInfo.discountPercentage}% OFF`
                                                                            : `AUD ${Number(offerInfo.offer.discountAmount)} OFF`}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                {/* Offer Validity */}
                                                {offerInfo.offer && (
                                                    <div className="flex flex-wrap gap-3 items-center">
                                                        <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{formatOfferValidity(offerInfo.offer.endDate)}</span>
                                                        </div>
                                                        {(offerInfo.offer.targetMembershipLevel || 0) > 0 && (
                                                            <span className={cn(
                                                                "px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 text-white shadow-sm",
                                                                offerInfo.offer.targetMembershipLevel === 2 ? "bg-amber-500" : "bg-indigo-600"
                                                            )}>
                                                                {offerInfo.offer.targetMembershipLevel === 2 ? <Gem size={10} /> : <Zap size={10} />}
                                                                {offerInfo.offer.targetMembershipLevel === 2 ? "JS Plus Exclusive" : "JS Pro Member"}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* All Active Offers List */}
                                                {otherOffers.some(o => o.offerTypeId !== 2 || o.id !== offerInfo.offer?.id) && (
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-bold text-[#253D4E]">Available Promotions:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {otherOffers.map((offer) => {
                                                                const isRestricted = (offer.targetMembershipLevel || 0) > userLevel;

                                                                let badgeContent = null;
                                                                let bgClass = "bg-slate-50 border-slate-200";
                                                                let textClass = "text-slate-700";
                                                                let icon = <Tag className="w-4 h-4" />;

                                                                if (offer.offerTypeId === 1) {
                                                                    const freeItemName = offer.freeProduct?.productName ? ` ${offer.freeProduct.productName}` : "";
                                                                    badgeContent = `Buy ${offer.buyQuantity} Get ${offer.getQuantity}${freeItemName} Free`;
                                                                    bgClass = isRestricted ? "bg-slate-50 grayscale opacity-70" : "bg-purple-50 border-purple-200";
                                                                    textClass = isRestricted ? "text-slate-400" : "text-purple-700";
                                                                    icon = <Gift className={isRestricted ? "w-4 h-4 text-slate-300" : "w-4 h-4 text-purple-600"} />;
                                                                } else if (offer.offerTypeId === 4) {
                                                                    const giftName = offer.freeProduct?.productName || "Gift";
                                                                    badgeContent = offer.buyQuantity && offer.buyQuantity > 0 ? `Buy ${offer.buyQuantity} Get ${offer.getQuantity || 1} ${giftName} Free` : `Free ${giftName}`;
                                                                    bgClass = isRestricted ? "bg-slate-50 grayscale opacity-70" : "bg-green-50 border-green-200";
                                                                    textClass = isRestricted ? "text-slate-400" : "text-green-700";
                                                                    icon = <Gift className={isRestricted ? "w-4 h-4 text-slate-300" : "w-4 h-4 text-green-600"} />;
                                                                } else if (offer.offerTypeId === 2 && offer.id !== offerInfo.offer?.id) {
                                                                    badgeContent = offer.discountPercentage ? `${offer.discountPercentage}% OFF` : `AUD ${offer.discountAmount} OFF`;
                                                                    bgClass = isRestricted ? "bg-slate-50 grayscale opacity-70" : "bg-red-50 border-red-200";
                                                                    textClass = isRestricted ? "text-slate-400" : "text-red-700";
                                                                }

                                                                if (!badgeContent) return null;

                                                                return (
                                                                    <div key={offer.id} className={cn("relative flex items-center gap-2 px-3 py-2 border rounded-lg", bgClass)}>
                                                                        {icon}
                                                                        <div className="flex flex-col">
                                                                            <span className={cn("text-xs font-bold leading-none", textClass)}>
                                                                                {badgeContent}
                                                                            </span>
                                                                            {isRestricted && (
                                                                                <span className="text-[9px] font-black uppercase text-amber-600 mt-1 flex items-center gap-1">
                                                                                    <Crown size={8} /> {offer.targetMembershipLevel === 2 ? "JS Plus Only" : "JS Pro Only"}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
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
                                < div className="flex flex-col sm:flex-row gap-3" >
                                    <Button
                                        type="button"
                                        onClick={handleAddToCart}
                                        disabled={Number(product.quantity) === 0}
                                        variant="outline"
                                        className="flex-1 h-12 sm:h-12 border-2 border-[#005000] text-[#005000] hover:bg-[#005000] hover:text-white font-bold rounded-xl disabled:opacity-60 transition-colors text-sm sm:text-base"
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleBuyNow}
                                        disabled={Number(product.quantity) === 0}
                                        className="flex-1 h-12 sm:h-12 bg-[#005000] hover:bg-[#006600] text-white font-bold rounded-xl disabled:opacity-60 transition-colors cursor-pointer text-sm sm:text-base"
                                    >
                                        Buy Now
                                    </Button>
                                </div >
                            </div >
                        </div >
                    </div >

                    {/* Related Products Section */}
                    {
                        relatedProducts.length > 0 && (
                            <div className="mt-12">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#253D4E]">
                                        Related Products
                                    </h2>
                                    <Link
                                        href={`/shop?category=${product.productCategoryId}`}
                                        className="text-[#005000] hover:text-[#006600] font-semibold text-sm flex items-center gap-1 transition-colors"
                                    >
                                        View All
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                {loadingRelated ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#005000]" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                        {relatedProducts.map((relatedProduct) => {
                                            const relatedImgs = getProductImages(relatedProduct);
                                            const relatedPrimary = relatedImgs.find((img) => img.isPrimary) || relatedImgs[0];
                                            const relatedImage = getProductImageUrl(relatedPrimary);
                                            const relatedLib = adaptToLibProduct(relatedProduct);
                                            return (
                                                <ProductCard key={relatedProduct.id} product={relatedLib} />
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div >

                {/* Reviews Section */}
                < ProductReviews productId={Number(id)} />
            </div >
        </div >
    );
}
