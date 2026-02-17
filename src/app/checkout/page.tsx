"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import orderService, { type ShippingAddressBackend } from "@/services/order.service";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { ShoppingBag, Loader2, MapPin, Plus, X, AlertCircle, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import productService, { getProductImageUrl, getProductImages } from "@/services/product.service";
import { offerService } from "@/services/offer.service";
import { calculateProductDiscount, calculateLineItemTotal, calculateCartTotals } from "@/utils/offerUtils";
import { cn } from "@/lib/utils";
import { membershipService, type UserSubscription } from "@/services/membership.service";
import { settingsService } from "@/services/settings.service";

const CheckoutContent = () => {
    const { cart, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<ShippingAddressBackend[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [showAddressPopup, setShowAddressPopup] = useState(false);
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [baseShippingFee, setBaseShippingFee] = useState(5.0);

    const [formData, setFormData] = useState({
        fullName: "",
        streetAddress: "",
        province: "",
        district: "",
        postalCode: "",
        phoneNumber: "",
        emailAddress: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [discountCode, setDiscountCode] = useState("");
    const [couponInput, setCouponInput] = useState("");
    // const [discountAmount, setDiscountAmount] = useState(0); // Removed: derived from totals

    const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
    const { addToCart } = useCart();

    const [allOffers, setAllOffers] = useState<any[]>([]);

    // Fetch coupons and offers on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const offers = await offerService.getAllOffers();
                const now = new Date();

                // Filter active offers
                const activeOffers = offers.filter((o: any) =>
                    o.isActive &&
                    new Date(o.startDate) <= now &&
                    new Date(o.endDate) >= now
                );
                setAllOffers(activeOffers);

                // Coupons (Type 3 or has code)
                const coupons = activeOffers.filter((o: any) =>
                    o.offerTypeId === 3 || o.couponCode
                );
                setAvailableCoupons(coupons);

            } catch (err) {
                console.error("Failed to fetch offers", err);
            }
        };
        fetchData();
    }, []);

    const searchParams = useSearchParams();
    const buyNowId = searchParams.get('productId');
    const buyNowQty = Number(searchParams.get('qty') || 1);

    const [buyNowItem, setBuyNowItem] = useState<any>(null);
    // Initialize loading state based on presence of ID to avoid flash of empty state
    const [loadingBuyNow, setLoadingBuyNow] = useState(!!buyNowId);

    useEffect(() => {
        if (buyNowId) {
            setLoadingBuyNow(true);
            Promise.all([
                productService.getById(Number(buyNowId)),
                offerService.getOffersByProduct(Number(buyNowId))
            ]).then(([product, offers]) => {
                const imgs = getProductImages(product);
                const img = imgs.find(i => i.isPrimary) || imgs[0];
                const imageUrl = img ? getProductImageUrl(img) : null;

                setBuyNowItem({
                    id: String(product.id),
                    name: product.productName,
                    price: Number(product.price), // Use original price so discounts are calculated consistently
                    quantity: buyNowQty,
                    image: imageUrl,
                    originalProduct: product
                });
            }).catch(err => {
                console.error("Failed to fetch buy now product", err);
                toast.error("Failed to load product details");
            }).finally(() => setLoadingBuyNow(false));
        }
    }, [buyNowId, buyNowQty]);

    const checkoutItems = buyNowId ? (buyNowItem ? [buyNowItem] : []) : cart;

    // Calculate Totals using comprehensive helper
    const totals = useMemo(() => {
        return calculateCartTotals(checkoutItems, allOffers, 5.0, discountCode);
    }, [checkoutItems, allOffers, discountCode]);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            toast.error("Please sign in to complete checkout");
            router.replace("/signin?redirect=/checkout");
            return;
        }
        setAuthChecked(true);
    }, [router]);

    useEffect(() => {
        if (!authChecked) return;
        const fetchAddresses = async () => {
            try {
                setLoadingAddresses(true);
                const addresses = await orderService.getShippingAddresses();
                setSavedAddresses(Array.isArray(addresses) ? addresses : []);
                if (addresses && Array.isArray(addresses) && addresses.length > 0) {
                    const primary = addresses.find(a => a.isPrimary) || addresses[0];
                    if (primary) {
                        setSelectedAddressId(primary.id);
                        setShowNewAddressForm(false);
                    }
                } else {
                    setShowNewAddressForm(true);
                }
            } catch (error: any) {
                console.error("Failed to fetch addresses:", error);
                if (error.response?.status !== 404) {
                    console.warn("Address fetch failed, showing form instead");
                }
                setSavedAddresses([]);
                setShowNewAddressForm(true);
            } finally {
                setLoadingAddresses(false);
            }
        };
        fetchAddresses();

        // Fetch Membership & Shipping Fee
        membershipService.getMySubscription().then(setSubscription);
        settingsService.getSettings().then(data => {
            const shippingSetting = data.storeSettings.find(s => s.configKey === 'SHIPPING_FEE');
            if (shippingSetting) setBaseShippingFee(parseFloat(shippingSetting.configValue));
        });
    }, [authChecked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name || ""]: e.target.value });
    };

    const handleApplyCoupon = (codeToApply?: string) => {
        const code = (codeToApply || couponInput).trim().toUpperCase();

        if (!code) {
            toast.error("Please enter a coupon code");
            return;
        }

        // Find coupon in available coupons
        const coupon = availableCoupons.find(c =>
            (c.couponCode?.toUpperCase() === code) ||
            (c.name?.toUpperCase() === code) ||
            (c.offerTypeId === 3 && c.name?.toUpperCase() === code) // Fallback for name as code
        );

        if (coupon) {
            // Validate constraints
            if (coupon.minOrderAmount && totals.subtotal < coupon.minOrderAmount) {
                toast.error(`Minimum order amount is AUD ${coupon.minOrderAmount}`);
                return;
            }

            if (coupon.maxUsage && coupon.currentUsage >= coupon.maxUsage) {
                toast.error("This coupon has reached its usage limit");
                return;
            }

            // Valid
            setDiscountCode(code);
            setCouponInput(code);
            toast.success(`Coupon applied: ${coupon.name}`);
        } else {
            // Legacy/Hardcoded check
            if (code === "JS10" || code === "WELCOME") {
                setDiscountCode(code);
                toast.success("Coupon applied!");
            } else {
                setDiscountCode("");
                toast.error("Invalid coupon code");
            }
        }
    };

    const handleRemoveCoupon = () => {
        setDiscountCode("");
        setCouponInput("");
        toast.success("Coupon removed");
    };
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const shipping = subscription ? 0 : baseShippingFee;
    const total = subtotal + shipping;

    const handlePlaceOrder = async () => {
        if (checkoutItems.length === 0) {
            toast.error("Your order is empty");
            return;
        }

        // Check if address is selected/added
        if (!selectedAddressId && !showNewAddressForm) {
            setShowAddressPopup(true);
            return;
        }

        if (showNewAddressForm && (!formData.fullName || !formData.streetAddress || !formData.phoneNumber || !formData.province || !formData.district)) {
            toast.error("Please fill in all required delivery details");
            return;
        }

        let shippingAddressId: number;

        if (selectedAddressId && !showNewAddressForm) {
            shippingAddressId = selectedAddressId;
        } else {
            const addressResponse = await orderService.createShippingAddress({
                fullName: formData.fullName,
                streetAddress: formData.streetAddress,
                province: formData.province,
                district: formData.district,
                postalCode: formData.postalCode,
                phoneNumber: formData.phoneNumber,
            });
            if (!addressResponse?.id) throw new Error("Failed to save delivery address");
            shippingAddressId = addressResponse.id;
        }

        setLoading(true);
        try {
            await orderService.createOrder({
                details: checkoutItems.map((item) => ({ productId: Number(item.id), quantity: item.quantity || 1 })),
                paymentTypeId: paymentMethod === "cod" ? 1 : 2,
                shippingAddressId,
                tax: 0,
                subtotal: totals.subtotal,
                totalAmount: totals.total,
                couponCode: discountCode || undefined,
            } as any);

            toast.success("Order placed successfully!");
            if (!buyNowId) {
                clearCart();
            }
            router.push("/account/orders");
        } catch (error: any) {
            console.error("Checkout Error:", error);
            toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAddress = async () => {
        if (!formData.fullName || !formData.streetAddress || !formData.phoneNumber || !formData.province || !formData.district) {
            toast.error("Please fill in all required delivery details");
            return;
        }

        try {
            const addressResponse = await orderService.createShippingAddress({
                fullName: formData.fullName,
                streetAddress: formData.streetAddress,
                province: formData.province,
                district: formData.district,
                postalCode: formData.postalCode,
                phoneNumber: formData.phoneNumber,
            });
            if (addressResponse?.id) {
                setSelectedAddressId(addressResponse.id);
                setShowNewAddressForm(false);
                setShowAddressPopup(false);
                // Refresh addresses
                const addresses = await orderService.getShippingAddresses();
                setSavedAddresses(Array.isArray(addresses) ? addresses : []);
                toast.success("Address added successfully!");
            }
        } catch (error: any) {
            toast.error("Failed to save address. Please try again.");
        }
    };

    if (!authChecked || loadingBuyNow) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#005000] mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">Loading...</p>
                </div>
            </div>
        );
    }

    if (!loadingBuyNow && checkoutItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="pt-8 pb-8">
                    <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#253D4E]">Checkout</h1>
                        <p className="text-gray-600 mt-1">Your cart is empty</p>
                    </div>
                </div>
                <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-lg mx-auto text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-[#253D4E] mb-2">No items to checkout</h2>
                        <p className="text-gray-600 mb-6">Add items from the shop to continue.</p>
                        <Link href="/shop">
                            <Button className="w-full sm:w-auto bg-[#005000] hover:bg-[#006600] text-white font-semibold rounded-lg px-8 py-3">
                                Go to Shop
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="pt-8 pb-4">
                <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#253D4E]">Checkout</h1>
                    <p className="text-gray-600 mt-1">Complete your order and we&apos;ll deliver to your door</p>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side: Product List with Totals */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="font-extrabold text-[#253D4E] text-lg mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {totals.itemsWithDiscount.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                                        <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                                            <Image
                                                src={item.image?.startsWith("http") ? item.image : item.image ? `/${item.image}` : "/placeholder.png"}
                                                alt={item.name}
                                                fill
                                                className="object-contain"
                                                sizes="80px"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-[#253D4E] text-sm mb-1">{item.name}</h3>
                                            <p className="text-gray-600 text-xs mb-2">Quantity: {item.quantity}</p>
                                            {item.appliedOffer && (
                                                <div className="mb-2">
                                                    {item.appliedOffer.offerTypeId === 1 && (
                                                        <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                                            Buy {item.appliedOffer.buyQuantity} Get {item.appliedOffer.getQuantity} Free
                                                        </span>
                                                    )}
                                                    {item.appliedOffer.offerTypeId === 2 && (
                                                        <span className="inline-block bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                                            {item.appliedOffer.discountPercentage}% OFF
                                                        </span>
                                                    )}
                                                    {item.appliedOffer.offerTypeId === 4 && (
                                                        <span className="inline-block bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                                            Free Product Offer
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                {item.originalPrice !== item.unitPrice && (
                                                    <p className="text-xs text-gray-400 line-through">
                                                        AUD {(item.originalPrice * item.quantity).toFixed(2)}
                                                    </p>
                                                )}
                                                <p className="text-[#FF4858] font-bold">AUD {item.lineTotal.toFixed(2)}</p>
                                                {item.savings > 0 && (
                                                    <p className="text-xs text-green-600 font-semibold">
                                                        (Saved AUD {item.savings.toFixed(2)})
                                                        {item.isFreeItem && <span className="ml-1 bg-green-100 text-green-800 px-1 rounded text-[10px]">FREE</span>}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Suggested Free Products (Type 4) */}
                        {totals.suggestedFreeProducts && totals.suggestedFreeProducts.length > 0 && (
                            <div className="bg-green-50 rounded-xl border-2 border-green-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <h2 className="font-extrabold text-[#005000] text-lg">Free Products Available!</h2>
                                </div>
                                <p className="text-sm text-gray-700 mb-4">Add these products to your cart and they'll be free:</p>
                                <div className="space-y-3">
                                    {totals.suggestedFreeProducts.map((freeProduct) => {
                                        const offer = allOffers.find(o => o.id === freeProduct.offerId);
                                        const triggerItem = checkoutItems.find(
                                            item => offer?.productId && String(item.id) === String(offer.productId)
                                        );
                                        return (
                                            <div key={freeProduct.productId} className="bg-white rounded-lg border border-green-200 p-4 flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-[#253D4E] text-sm mb-1">
                                                        {freeProduct.productName}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        Get {freeProduct.quantity} free when you buy {offer?.buyQuantity || 1} {triggerItem?.name || 'item'}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="h-8 px-4 text-xs bg-[#005000] hover:bg-[#006600] text-white"
                                                    onClick={async () => {
                                                        try {
                                                            const product = await productService.getById(freeProduct.productId);
                                                            const imgs = getProductImages(product);
                                                            const img = imgs.find(i => i.isPrimary) || imgs[0];
                                                            const imageUrl = img ? getProductImageUrl(img) : null;
                                                            
                                                            const newItem = {
                                                                id: String(product.id),
                                                                name: product.productName,
                                                                price: Number(product.price || 0),
                                                                image: imageUrl || "/placeholder.png",
                                                            };
                                                            
                                                            if (buyNowId && buyNowItem) {
                                                                const currentItem = {
                                                                    id: buyNowItem.id,
                                                                    name: buyNowItem.name,
                                                                    price: Number(buyNowItem.price),
                                                                    image: buyNowItem.image,
                                                                };
                                                                addToCart(currentItem as any, buyNowQty);
                                                                addToCart(newItem as any, freeProduct.quantity);
                                                                router.replace('/checkout');
                                                            } else {
                                                                addToCart(newItem as any, freeProduct.quantity);
                                                            }
                                                            toast.success(`Added ${freeProduct.productName} - it's free!`);
                                                        } catch (err) {
                                                            console.error("Failed to add free product", err);
                                                            toast.error("Failed to add free product");
                                                        }
                                                    }}
                                                >
                                                    Add Free
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Bill & Discounts Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="font-extrabold text-[#253D4E] text-lg mb-4">Bill Summary</h2>

                            {/* Available Coupons UI */}
                            {availableCoupons.length > 0 && (
                                <div className="mb-6 pb-6 border-b border-gray-200">
                                    <h3 className="text-sm font-bold text-[#253D4E] mb-3">Available Coupons</h3>
                                    <div className="space-y-3">
                                        {availableCoupons.map((coupon) => (
                                            <div key={coupon.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Coupon Code</p>
                                                        <p className="text-lg font-bold text-[#005000]">{coupon.couponCode || coupon.name}</p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApplyCoupon(coupon.couponCode || coupon.name)}
                                                        disabled={(coupon.minOrderAmount && totals.subtotal < coupon.minOrderAmount) || discountCode === (coupon.couponCode || coupon.name)}
                                                        className="h-8 px-4 text-xs bg-[#005000] hover:bg-[#006600]"
                                                    >
                                                        {discountCode === (coupon.couponCode || coupon.name) ? "Applied" : "Claim"}
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-gray-100 pt-3 mb-3">
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-0.5">Benefit</p>
                                                        <p className="font-semibold text-[#253D4E]">
                                                            {coupon.discountPercentage ? `${coupon.discountPercentage}%` : `AUD ${coupon.discountAmount}`}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-0.5">Threshold</p>
                                                        <p className="font-semibold text-[#253D4E]">
                                                            {coupon.minOrderAmount ? `AUD ${parseFloat(coupon.minOrderAmount).toFixed(2)}` : 'None'}
                                                        </p>
                                                    </div>
                                                    {coupon.maxUsage && (
                                                        <div className="col-span-2">
                                                            <p className="text-xs text-gray-500 mb-0.5">Usage Limit</p>
                                                            <p className="font-semibold text-[#253D4E] text-sm">
                                                                {coupon.currentUsage || 0} / {coupon.maxUsage} REDEEMED
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="text-[10px] font-bold text-gray-400 uppercase border-t border-gray-100 pt-2 tracking-wide">
                                                    EXPIRES {new Date(coupon.endDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Coupon Code Section */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h3 className="text-sm font-bold text-[#253D4E] mb-2">Have a coupon?</h3>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        className="h-10 text-sm border-gray-300 focus:ring-[#005000] flex-1"
                                        disabled={!!discountCode}
                                    />
                                    {discountCode ? (
                                        <Button
                                            onClick={handleRemoveCoupon}
                                            variant="outline"
                                            className="h-10 px-4 sm:px-6 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 whitespace-nowrap"
                                        >
                                            Remove
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleApplyCoupon()}
                                            className="h-10 px-4 sm:px-6 bg-[#253D4E] hover:bg-[#1a2b37] text-white whitespace-nowrap"
                                        >
                                            Apply
                                        </Button>
                                    )}
                                </div>
                                {discountCode && totals.discountTotal > 0 && (
                                    <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                        Coupon &quot;{discountCode}&quot; applied successfully
                                    </p>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">AUD {totals.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-semibold">AUD {totals.shipping.toFixed(2)}</span>
                                </div>
                                {totals.discountTotal > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span className="font-semibold">-AUD {totals.discountTotal.toFixed(2)}</span>
                                    <div className="flex items-center gap-2">
                                        <span>Shipping</span>
                                        {subscription && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-md uppercase tracking-wider border border-indigo-100 italic">
                                                <ShieldCheck size={12} /> Member Free Shipping
                                            </span>
                                        )}
                                    </div>
                                    <span className={cn("font-semibold", subscription && "text-emerald-600 line-through opacity-50")}>
                                        AUD {baseShippingFee.toFixed(2)}
                                    </span>
                                </div>
                                {subscription && (
                                    <div className="flex justify-between text-emerald-600 font-bold text-sm">
                                        <span>Membership Discount</span>
                                        <span>- AUD {baseShippingFee.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xl font-bold text-[#253D4E] pt-3 border-t border-gray-200">
                                    <span>Bill Total</span>
                                    <span className="text-[#005000]">AUD {totals.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Address & Payment */}
                    <div className="space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="font-extrabold text-[#253D4E] text-lg mb-4">Delivery Address</h2>

                            {loadingAddresses ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-[#005000] mr-2" />
                                    <span className="text-gray-600">Loading addresses...</span>
                                </div>
                            ) : savedAddresses.length > 0 && !showNewAddressForm ? (
                                <>
                                    <div className="space-y-3">
                                        {savedAddresses.map((address) => (
                                            <label
                                                key={address.id}
                                                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedAddressId === address.id
                                                    ? "border-[#005000] bg-green-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    checked={selectedAddressId === address.id}
                                                    onChange={() => setSelectedAddressId(address.id)}
                                                    className="mt-1 w-4 h-4 text-[#005000] focus:ring-[#005000]"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <MapPin className="w-4 h-4 text-[#005000]" />
                                                        <span className="font-semibold text-[#253D4E]">
                                                            {address.addressLine1}
                                                        </span>
                                                        {address.isPrimary && (
                                                            <span className="px-2 py-0.5 bg-[#005000] text-white text-xs font-medium rounded">
                                                                Primary
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {address.addressLine2 && `${address.addressLine2}, `}
                                                        {address.city}
                                                        {address.state && `, ${address.state}`}
                                                        {address.postalCode && ` ${address.postalCode}`}
                                                    </p>
                                                    {address.country && (
                                                        <p className="text-xs text-gray-500 mt-1">{address.country}</p>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowNewAddressForm(true);
                                            setSelectedAddressId(null);
                                        }}
                                        className="w-full mt-4 border-[#005000] text-[#005000] hover:bg-[#005000] hover:text-white"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add New Address
                                    </Button>
                                </>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#253D4E] mb-2">Full Name *</label>
                                        <Input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="w-full h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005000] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#253D4E] mb-2">Street Address *</label>
                                        <Input
                                            type="text"
                                            name="streetAddress"
                                            value={formData.streetAddress}
                                            onChange={handleChange}
                                            placeholder="Street address"
                                            className="w-full h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005000] focus:border-transparent"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">Province *</label>
                                            <Input
                                                type="text"
                                                name="province"
                                                value={formData.province}
                                                onChange={handleChange}
                                                placeholder="Province"
                                                className="w-full h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005000] focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">District *</label>
                                            <Input
                                                type="text"
                                                name="district"
                                                value={formData.district}
                                                onChange={handleChange}
                                                placeholder="District"
                                                className="w-full h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005000] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">Postal Code</label>
                                            <Input
                                                type="text"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleChange}
                                                placeholder="Postal Code"
                                                className="w-full h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005000] focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#253D4E] mb-2">Phone Number *</label>
                                            <Input
                                                type="tel"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                placeholder="Phone Number"
                                                className="w-full h-12 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005000] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    {savedAddresses.length > 0 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setShowNewAddressForm(false);
                                                const primary = savedAddresses.find(a => a.isPrimary) || savedAddresses[0];
                                                if (primary) setSelectedAddressId(primary.id);
                                            }}
                                            className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
                                        >
                                            Use Saved Address
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-extrabold text-[#253D4E] text-lg mb-4">Payment Method</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="bank"
                                        checked={paymentMethod === "bank"}
                                        onChange={() => setPaymentMethod("bank")}
                                        className="w-4 h-4 text-[#005000] focus:ring-[#005000]"
                                    />
                                    <span className="font-semibold text-[#253D4E]">Bank Transfer</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === "cod"}
                                        onChange={() => setPaymentMethod("cod")}
                                        className="w-4 h-4 text-[#005000] focus:ring-[#005000]"
                                    />
                                    <span className="font-semibold text-[#253D4E]">Cash on Delivery</span>
                                </label>
                            </div>
                        </div>

                        {/* Place Order Button */}
                        <Button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full h-12 bg-[#005000] hover:bg-[#006600] text-white font-bold text-base rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Placing Order...
                                </>
                            ) : (
                                `Place Order - AUD ${totals.total.toFixed(2)}`
                            )}
                        </Button>
                    </div>
                </div>

                {/* Address Popup for Quick Selection if user clicks Place Order without address */}
                {showAddressPopup && savedAddresses.length > 0 && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
                            <button
                                onClick={() => setShowAddressPopup(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <AlertCircle className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="text-lg font-bold text-[#253D4E]">Select Delivery Address</h3>
                                <p className="text-gray-600 text-sm">Please select a delivery address to complete your order</p>
                            </div>

                            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                                {savedAddresses.map((address) => (
                                    <div
                                        key={address.id}
                                        onClick={() => {
                                            setSelectedAddressId(address.id);
                                            setShowAddressPopup(false);
                                            // Optional: immediately place order or let user click button again
                                        }}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-[#005000] hover:bg-green-50 cursor-pointer transition-colors"
                                    >
                                        <p className="font-semibold text-[#253D4E] text-sm">{address.addressLine1}</p>
                                        <p className="text-xs text-gray-500">{address.city}, {address.state}</p>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={() => {
                                    setShowAddressPopup(false);
                                    setShowNewAddressForm(true);
                                }}
                                variant="outline"
                                className="w-full border-gray-200"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Address
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#005000]" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
