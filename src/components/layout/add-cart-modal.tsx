"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { offerService } from "@/services/offer.service";
import { couponService } from "@/services/coupon.service";
import { membershipService, type UserSubscription } from "@/services/membership.service";
import { calculateCartTotals } from "@/utils/offerUtils";
import { ShieldCheck, Tag, X } from "lucide-react";

type CartModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function CartModal({ isOpen, onClose }: CartModalProps) {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const router = useRouter();
    const [allOffers, setAllOffers] = useState<any[]>([]);
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);

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
                    offerTypeId: 3
                }));
                setAllOffers([...offers, ...consolidatedCoupons]);
            });
            membershipService.getMySubscription().then(setSubscription).catch(() => setSubscription(null));
        }
    }, [isOpen]);

    const totals = useMemo(() => {
        const userLevel = subscription?.plan?.level || 0;
        return calculateCartTotals(cart, allOffers, 0, undefined, userLevel);
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
            {/* Modal Container */}
            <div className="bg-white w-full sm:w-96 h-full flex flex-col shadow-xl rounded-l-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold">Your Cart</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-lg font-bold"
                    >
                        ✖
                    </button>
                </div>

                {/* Cart Items */}
                {cart.length === 0 ? (
                    <div className="flex flex-col flex-1 justify-end">
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-gray-500 text-lg">Your cart is empty 😢</p>
                        </div>
                        <div className="p-6 border-t">
                            <Button
                                onClick={handleStartShopping}
                                className="w-full bg-[#005000] hover:bg-[#006600] text-white py-2 rounded-md"
                            >
                                Start Shopping
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {totals.itemsWithDiscount.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-start border-b pb-4 last:border-0 relative"
                                >
                                    <div className="flex gap-4 flex-1">
                                        <div className="relative h-20 w-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                            <img
                                                src={item.image?.startsWith("http") ? item.image : item.image ? `/${item.image}` : "/placeholder.png"}
                                                className="h-full w-full object-contain"
                                                alt={item.name}
                                            />
                                            {item.isFreeItem && (
                                                <div className="absolute top-0 left-0 bg-green-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-br shadow-sm z-10">FREE</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-[#253D4E] text-sm mb-1 truncate">{item.name}</p>

                                            {item.appliedOffer && (
                                                <div className="flex items-center gap-1 mb-1.5">
                                                    <Tag size={10} className="text-[#005000]" />
                                                    <span className="text-[10px] font-bold text-[#005000] uppercase tracking-tighter">
                                                        {item.appliedOffer.name}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3 mt-1">
                                                {!item.isFreeItem && (
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={item.quantity || 1}
                                                        onChange={(e) =>
                                                            updateQuantity(item.originalId, Number(e.target.value))
                                                        }
                                                        className="w-12 border border-gray-200 rounded px-1.5 py-0.5 text-xs font-semibold focus:ring-1 focus:ring-[#005000] outline-none"
                                                    />
                                                )}
                                                <button
                                                    onClick={() => removeFromCart(item.originalId)}
                                                    className="text-red-500 hover:text-red-700 text-[10px] font-bold uppercase tracking-tight"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end pt-1">
                                        {item.originalPrice !== item.unitPrice && (
                                            <p className="text-[10px] text-gray-400 line-through">
                                                AUD {(item.originalPrice * item.quantity).toFixed(2)}
                                            </p>
                                        )}
                                        <p className="font-black text-[#253D4E] text-sm">
                                            {item.isFreeItem ? "FREE" : `AUD ${item.lineTotal.toFixed(2)}`}
                                        </p>
                                        {item.savings > 0 && (
                                            <p className="text-[9px] text-green-600 font-bold whitespace-nowrap">
                                                Saved AUD {item.savings.toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Totals */}
                        <div className="p-6 border-t bg-gray-50/50 space-y-3">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-[#253D4E]">AUD {totals.subtotal.toFixed(2)}</span>
                                </div>

                                {totals.automaticDiscountTotal > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 font-bold">
                                        <div className="flex items-center gap-1">
                                            <ShieldCheck size={14} />
                                            <span>{totals.appliedAutomaticOffer?.name || "Member Discount"}</span>
                                        </div>
                                        <span>- AUD {totals.automaticDiscountTotal.toFixed(2)}</span>
                                    </div>
                                )}

                                {totals.couponDiscountTotal > 0 && (
                                    <div className="flex justify-between text-sm text-blue-600 font-bold">
                                        <div className="flex items-center gap-1">
                                            <Tag size={14} />
                                            <span>Coupon: {totals.appliedCoupon?.couponCode || "Applied"}</span>
                                        </div>
                                        <span>- AUD {totals.couponDiscountTotal.toFixed(2)}</span>
                                    </div>
                                )}

                                {subscription && (
                                    <div className="flex justify-between text-[10px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">
                                        <span>Member Free Shipping</span>
                                        <span>Active</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-black text-[#253D4E] uppercase tracking-tighter">Total Amount</span>
                                    <span className="text-xl font-black text-[#005000]">AUD {totals.total.toFixed(2)}</span>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={clearCart}
                                        variant="outline"
                                        className="flex-1 border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 font-bold text-xs uppercase"
                                    >
                                        Clear
                                    </Button>
                                    <Button
                                        onClick={handleCheckout}
                                        className="flex-[2] bg-[#005000] hover:bg-[#006600] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-green-900/10"
                                    >
                                        Checkout
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
