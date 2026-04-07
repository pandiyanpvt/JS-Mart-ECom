"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ArrowRight, Tag, Percent, ShieldCheck, Gem, Zap, Loader2, X } from "lucide-react";
import { CartOutlineIcon } from "@/components/icons/CartOutlineIcon";
import { offerService } from "@/services/offer.service";
import { couponService } from "@/services/coupon.service";
import { calculateCartTotals } from "@/utils/offerUtils";
import { membershipService, type UserSubscription } from "@/services/membership.service";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useModal } from "@/components/providers/ModalProvider";
import { resolveImageSrc } from "@/lib/images";

export default function ShoppingCart() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const router = useRouter();
    const [offers, setOffers] = useState([]);
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [loading, setLoading] = useState(true);
    const { showModal } = useModal();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [offersData, couponsData, subData] = await Promise.all([
                    offerService.getAllOffers(),
                    couponService.getAllCoupons(),
                    membershipService.getMySubscription()
                ]);

                // Consolidation for calculating logic
                const consolidatedCoupons = couponsData.map(c => ({
                    ...c,
                    name: c.description || c.couponCode,
                    offerTypeId: 3
                }));

                setOffers([...offersData, ...consolidatedCoupons]);
                setSubscription(subData);
            } catch (err) {
                console.error("Failed to load cart context data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totals = useMemo(() => {
        const userLevel = subscription?.plan?.level || 0;
        const normalizedCart = cart.map(item => ({ ...item, quantity: item.quantity ?? 1 }));
        return calculateCartTotals(normalizedCart, offers, 0, undefined, userLevel);
    }, [cart, offers, subscription]);

    const handleCheckout = () => {
        if (!cart.length) return;
        router.push("/checkout");
    };

    const handleUpdateQuantity = (originalId: string, currentQty: number, delta: number) => {
        const newQty = Math.max(1, currentQty + delta);
        updateQuantity(originalId, newQty);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#005000] mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold tracking-wide">Preparing your basket...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-16">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-[#253D4E] tracking-tight text-center md:text-left">Shopping Cart</h1>
                        <p className="text-gray-500 mt-2 font-medium text-center md:text-left">
                            {cart.length === 0 ? "Your cart is empty" : `You have ${cart.length} unique item${cart.length > 1 ? 's' : ''} in your cart`}
                        </p>
                    </div>
                    {cart.length > 0 && (
                        <button
                            onClick={() => {
                                showModal({
                                    title: "Clear Cart",
                                    message: "Are you sure you want to remove all items from your shopping cart?",
                                    type: "warning",
                                    confirmLabel: "Clear Cart",
                                    onConfirm: () => clearCart()
                                });
                            }}
                            className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 self-center md:self-end"
                        >
                            <Trash2 size={16} /> Clear Cart
                        </button>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border border-dashed border-gray-200 py-20 px-4 text-center shadow-sm">
                        <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CartOutlineIcon className="w-12 h-12 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#253D4E] mb-3">Your cart is currently empty</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            Looks like you haven&apos;t added any items to your cart yet. Explore our products and discover amazing deals!
                        </p>
                        <Link href="/shop">
                            <Button className="bg-[#005000] hover:bg-[#006600] text-white font-black px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 gap-2">
                                Start Shopping <ArrowRight size={20} />
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
                                {/* Header */}
                                <div className="hidden md:grid grid-cols-[1fr_120px_150px_120px_50px] gap-4 px-8 py-5 bg-gray-50 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                    <div>Product Details</div>
                                    <div className="text-center">Price</div>
                                    <div className="text-center">Quantity</div>
                                    <div className="text-end">Total</div>
                                    <div className="text-center"></div>
                                </div>

                                <ul className="divide-y divide-gray-50">
                                    {totals.itemsWithDiscount.map((item) => (
                                        <li key={item.id} className={cn(
                                            "p-6 md:p-8 transition-colors group relative",
                                            item.isFreeItem ? "bg-green-50/30" : "hover:bg-gray-50/50"
                                        )}>
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_150px_120px_50px] gap-6 items-center">
                                                {/* Info */}
                                                <div className="flex items-center gap-6">
                                                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-white rounded-2xl p-2 border border-gray-100 shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                                        <Image
                                                            src={resolveImageSrc(item.image)}
                                                            alt={item.name}
                                                            fill
                                                            className="object-contain"
                                                            sizes="112px"
                                                        />
                                                        {item.isFreeItem && (
                                                            <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm z-10">FREE</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-bold text-[#253D4E] group-hover:text-[#005000] transition-colors line-clamp-2">
                                                            {item.name}
                                                        </h3>

                                                        {/* Applied Offers below product */}
                                                        {item.appliedOffer && (
                                                            <div className="mt-3 flex flex-wrap gap-2">
                                                                <span className={cn(
                                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                                                    item.appliedOffer.offerTypeId === 1 ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                                        item.appliedOffer.offerTypeId === 2 ? "bg-orange-50 text-orange-700 border-orange-100" :
                                                                            "bg-purple-50 text-purple-700 border-purple-100"
                                                                )}>
                                                                    <Tag size={10} />
                                                                    {item.appliedOffer.name}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="text-center">
                                                    <p className="text-gray-400 text-xs line-through font-bold mb-1">
                                                        {(item.originalPrice !== item.unitPrice && !item.isFreeItem) && `AUD ${item.originalPrice.toFixed(2)}`}
                                                    </p>
                                                    <p className={cn(
                                                        "font-bold text-lg",
                                                        item.isFreeItem ? "text-green-600" : "text-[#253D4E]"
                                                    )}>
                                                        {item.isFreeItem ? "FREE" : `AUD ${item.unitPrice.toFixed(2)}`}
                                                    </p>
                                                </div>

                                                {/* Quantity */}
                                                <div className="flex justify-center">
                                                    {!item.isFreeItem ? (
                                                        <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item.originalId, item.quantity, -1)}
                                                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-gray-500"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="w-10 text-center font-bold text-gray-700 text-sm">{item.quantity}</span>
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item.originalId, item.quantity, 1)}
                                                                className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-gray-500"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                                                    )}
                                                </div>

                                                {/* Line Total */}
                                                <div className="text-end">
                                                    <p className={cn(
                                                        "text-xl font-black",
                                                        item.isFreeItem ? "text-green-600" : "text-[#005000]"
                                                    )}>
                                                        {item.isFreeItem ? "FREE" : `AUD ${item.lineTotal.toFixed(2)}`}
                                                    </p>
                                                    {item.savings > 0 && (
                                                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">Saved AUD {item.savings.toFixed(2)}</p>
                                                    )}
                                                </div>

                                                {/* Remove Button */}
                                                <div className="text-center">
                                                    {!item.isFreeItem && (
                                                        <button
                                                            onClick={() => removeFromCart(item.originalId)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                                            title="Remove from cart"
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="lg:sticky lg:top-8 space-y-6">
                            <div className="bg-[#253D4E] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden text-center md:text-left">
                                <h2 className="text-2xl font-black mb-6">Summary</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-white/70">
                                        <span className="font-medium">Subtotal</span>
                                        <span className="font-bold text-lg text-white">AUD {totals.subtotal.toFixed(2)}</span>
                                    </div>

                                    {totals.itemLevelDiscountTotal > 0 && (
                                        <div className="flex justify-between items-center text-green-300">
                                            <span className="font-medium">Product Discounts</span>
                                            <span className="font-bold">- AUD {totals.itemLevelDiscountTotal.toFixed(2)}</span>
                                        </div>
                                    )}

                                    {totals.automaticDiscountTotal > 0 && (
                                        <div className="flex justify-between items-center text-emerald-400">
                                            <span className="font-medium">{totals.appliedAutomaticOffer?.name || "Automatic Discount"}</span>
                                            <span className="font-bold">- AUD {totals.automaticDiscountTotal.toFixed(2)}</span>
                                        </div>
                                    )}

                                    {totals.couponDiscountTotal > 0 && (
                                        <div className="flex justify-between items-center text-blue-300">
                                            <span className="font-medium">Coupon: {totals.appliedCoupon?.couponCode || "Applied"}</span>
                                            <span className="font-bold">- AUD {totals.couponDiscountTotal.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-white/10 mt-4">
                                        <div className="flex justify-between items-end">
                                            <div className="text-left">
                                                <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Total Bill</p>
                                                <span className="text-3xl font-black">AUD {totals.total.toFixed(2)}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest italic">All Taxes Included</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    className="w-full bg-[#005000] hover:bg-[#006600] text-white font-black py-7 rounded-2xl shadow-xl transition-all duration-300 gap-3 group"
                                >
                                    Proceed to Checkout
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Button>

                                <Link href="/shop" className="block text-center mt-6 text-sm font-bold text-white/60 hover:text-white transition-colors">
                                    Return to Shopping
                                </Link>
                            </div>

                            {subscription && (
                                <div className="bg-gradient-to-br from-[#005000] to-emerald-900 rounded-[1.5rem] p-6 text-white shadow-lg text-center md:text-left">
                                    <h3 className="font-black text-lg mb-2 flex items-center justify-center md:justify-start gap-2 italic">
                                        <ShieldCheck className="text-white" size={20} /> Member Active
                                    </h3>
                                    <p className="text-xs text-white/70 font-medium">
                                        You are enjoying <span className="text-white font-bold tracking-tight uppercase px-1.5 py-0.5 bg-white/10 rounded">{subscription.plan?.name}</span> benefits!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
