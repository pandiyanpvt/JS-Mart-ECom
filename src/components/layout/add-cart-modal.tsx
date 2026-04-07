"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { offerService } from "@/services/offer.service";
import { couponService } from "@/services/coupon.service";
import { membershipService, type UserSubscription } from "@/services/membership.service";
import { calculateCartTotals } from "@/utils/offerUtils";
import { ShieldCheck, Tag, X, Plus, Minus } from "lucide-react";
import { CartOutlineIcon } from "@/components/icons/CartOutlineIcon";
import { cn } from "@/lib/utils";
import { resolveImageSrc } from "@/lib/images";

type CartModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function CartModal({ isOpen, onClose }: CartModalProps) {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const router = useRouter();
    const [allOffers, setAllOffers] = useState<any[]>([]);
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch data on mount
    useEffect(() => {
        if (isOpen) {
            Promise.all([
                offerService.getAllOffers(),
                couponService.getAllCoupons()
            ]).then(([offers, coupons]) => {
                const consolidatedCoupons = coupons.map(c => ({
                    ...c,
                    name: c.description || c.couponCode,
                    offerTypeId: 3,
                    isActive: true,
                    startDate: new Date().toISOString(),
                    endDate: c.expiryDate
                }));
                setAllOffers([...offers, ...consolidatedCoupons]);
            });
            membershipService.getMySubscription().then(setSubscription).catch(() => setSubscription(null));
        }
    }, [isOpen]);

    const totals = useMemo(() => {
        const userLevel = subscription?.plan?.level || 0;
        // Ensure cart items match CartItem interface (quantity is required)
        const cartItems = cart.map(item => ({
            ...item,
            quantity: item.quantity || 1
        }));
        return calculateCartTotals(cartItems, allOffers, 0, undefined, userLevel);
    }, [cart, allOffers, subscription]);

    const handleCheckout = () => {
        if (!cart.length) return;
        onClose();
        router.push("/checkout");
    };

    const handleStartShopping = () => {
        onClose();
        router.push("/shop");
    };

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!mounted) return null;

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-[99999] flex justify-end transition-all duration-300",
                isOpen ? "bg-black/50 visible opacity-100" : "bg-black/0 invisible opacity-0 pointer-events-none"
            )}
            onClick={onClose}
        >
            {/* Modal Sidebar */}
            <div
                className={cn(
                    "bg-white w-full sm:w-[450px] h-full flex flex-col shadow-2xl transition-transform duration-300 ease-out transform",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <CartOutlineIcon className="h-6 w-6 text-[#005000]" />
                        <h2 className="text-xl font-black text-[#253D4E] tracking-tight">Your Cart</h2>
                        <span className="bg-[#005000] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                            {cart.length}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                        aria-label="Close cart"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Cart Items */}
                {cart.length === 0 ? (
                    <div className="flex flex-col flex-1 justify-center items-center p-8 text-center bg-white animate-in fade-in duration-500">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <CartOutlineIcon className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 text-sm mb-8 max-w-[240px] leading-relaxed">
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <Button
                            onClick={handleStartShopping}
                            className="bg-[#005000] hover:bg-[#006600] text-white font-bold py-6 px-10 rounded-2xl shadow-xl shadow-green-900/20 transition-all hover:scale-105 active:scale-95 gap-2"
                        >
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/30">
                            {totals.itemsWithDiscount.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                                >
                                    {/* Image */}
                                    <div className="relative h-24 w-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                        <img
                                            src={resolveImageSrc(item.image)}
                                            className="h-full w-full object-contain p-2 mix-blend-multiply"
                                            alt={item.name}
                                        />
                                        {item.isFreeItem && (
                                            <div className="absolute top-0 left-0 bg-green-500 text-white text-[9px] font-black px-2 py-1 rounded-br-lg shadow-sm z-10 uppercase tracking-wider">FREE</div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="font-bold text-[#253D4E] text-sm leading-snug mb-1 line-clamp-2 pr-6" title={item.name}>
                                                    {item.name}
                                                </h4>

                                                {/* Delete Button */}
                                                {!item.isFreeItem && (
                                                    <button
                                                        onClick={() => removeFromCart(item.originalId)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors p-1 -mr-2 -mt-2"
                                                        title="Remove item"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>

                                            {item.appliedOffer && (
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold uppercase tracking-wider">
                                                        <Tag size={10} />
                                                        {item.appliedOffer.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-end mt-2">
                                            {/* Quantity Controls */}
                                            {!item.isFreeItem ? (
                                                <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                                                    <button
                                                        onClick={() => updateQuantity(item.originalId, Math.max(1, (item.quantity || 1) - 1))}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md text-gray-500 transition-colors disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold text-gray-700 tabular-nums">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.originalId, (item.quantity || 1) + 1)}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md text-gray-500 transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Qty: {item.quantity}</span>
                                            )}

                                            {/* Price */}
                                            <div className="text-right">
                                                {item.originalPrice !== item.unitPrice && !item.isFreeItem && (
                                                    <p className="text-[10px] text-gray-400 line-through font-medium mb-0.5">
                                                        AUD {(item.originalPrice * item.quantity).toFixed(2)}
                                                    </p>
                                                )}
                                                <p className={cn(
                                                    "font-black text-base leading-none",
                                                    item.isFreeItem ? "text-green-600" : "text-[#253D4E]"
                                                )}>
                                                    {item.isFreeItem ? "FREE" : `AUD ${item.lineTotal.toFixed(2)}`}
                                                </p>
                                                {item.savings > 0 && (
                                                    <p className="text-[9px] text-green-600 font-bold whitespace-nowrap mt-0.5">
                                                        Saved AUD {item.savings.toFixed(2)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Totals */}
                        <div className="p-6 border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-xs font-medium text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-bold">AUD {totals.subtotal.toFixed(2)}</span>
                                </div>

                                {totals.itemLevelDiscountTotal > 0 && (
                                    <div className="flex justify-between text-xs font-medium text-green-600">
                                        <span>Product Discounts</span>
                                        <span>- AUD {totals.itemLevelDiscountTotal.toFixed(2)}</span>
                                    </div>
                                )}

                                {totals.automaticDiscountTotal > 0 && (
                                    <div className="flex justify-between text-xs font-bold text-emerald-600">
                                        <div className="flex items-center gap-1.5">
                                            <ShieldCheck size={12} />
                                            <span>{totals.appliedAutomaticOffer?.name || "Auto Discount"}</span>
                                        </div>
                                        <span>- AUD {totals.automaticDiscountTotal.toFixed(2)}</span>
                                    </div>
                                )}

                                {totals.couponDiscountTotal > 0 && (
                                    <div className="flex justify-between text-xs font-bold text-blue-600">
                                        <div className="flex items-center gap-1.5">
                                            <Tag size={12} />
                                            <span>Coupon: {totals.appliedCoupon?.couponCode}</span>
                                        </div>
                                        <span>- AUD {totals.couponDiscountTotal.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="pt-3 border-t border-dashed border-gray-200 mt-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Total Payable</p>
                                            <p className="text-2xl font-black text-[#005000] leading-none">
                                                AUD {totals.total.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                Taxes included
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={clearCart}
                                    variant="outline"
                                    className="flex-1 border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 font-bold text-xs uppercase h-12 rounded-xl"
                                >
                                    Clear Cart
                                </Button>
                                <Button
                                    onClick={handleCheckout}
                                    className="flex-[2] bg-[#005000] hover:bg-[#006600] text-white font-black text-sm uppercase tracking-wider h-12 rounded-xl shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Checkout Now
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}
