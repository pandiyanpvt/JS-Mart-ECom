"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import orderService, { type ShippingAddressBackend } from "@/services/order.service";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { ShoppingBag, Loader2, MapPin, Plus, X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CheckoutPage = () => {
    const { cart, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<ShippingAddressBackend[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [showAddressPopup, setShowAddressPopup] = useState(false);

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
    }, [authChecked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name || ""]: e.target.value });
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const shipping = 5.0;
    const total = subtotal + shipping;

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            toast.error("Your cart is empty");
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
                details: cart.map((item) => ({ productId: Number(item.id), quantity: item.quantity || 1 })),
                paymentTypeId: paymentMethod === "cod" ? 1 : 2,
                shippingAddressId,
                tax: 0,
                subtotal,
                totalAmount: total,
                couponCode: discountCode || undefined,
            } as any);

            toast.success("Order placed successfully!");
            clearCart();
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

    if (!authChecked) {
        return (
            <div className="min-h-screen bg-gray-50 pt-[92px] pb-12 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#005000] mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold">Loading...</p>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="pt-[100px] pb-8">
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
            <div className="pt-[92px] pb-4">
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
                            <h2 className="font-extrabold text-[#253D4E] text-lg mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                {cart.map((item) => (
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
                                            <p className="text-gray-600 text-xs mb-2">Quantity: {item.quantity || 1}</p>
                                            <p className="text-[#FF4858] font-bold">AUD {(item.price * (item.quantity || 1)).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">AUD {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-semibold">AUD {shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-[#253D4E] pt-3 border-t border-gray-200">
                                    <span>Total</span>
                                    <span className="text-[#005000]">AUD {total.toFixed(2)}</span>
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
                                                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                                                    selectedAddressId === address.id
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
                                    Placing order...
                                </>
                            ) : (
                                <>Place Order</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Address Popup Modal */}
            {showAddressPopup && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-[#253D4E]">Shipping Address Not Added</h3>
                            </div>
                            <button
                                onClick={() => setShowAddressPopup(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-6">Please add a shipping address to complete your order.</p>
                        <div className="space-y-4">
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
                            <div className="grid grid-cols-2 gap-4">
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
                            <div className="grid grid-cols-2 gap-4">
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
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setShowAddressPopup(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveAddress}
                                className="flex-1 bg-[#005000] hover:bg-[#006600] text-white"
                            >
                                Add Address & Continue
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
