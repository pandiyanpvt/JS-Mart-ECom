"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import orderService, { CreateOrderData } from "@/services/order.service";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const CheckoutPage = () => {
    const { cart, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        streetAddress: "",
        province: "",
        district: "",
        postalCode: "",
        phoneNumber: "",
        emailAddress: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' or 'bank'
    const [discountCode, setDiscountCode] = useState("");

    // Check Auth
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            toast.error("Please sign in to complete your checkout");
            router.push("/signin?redirect=/checkout");
        }
    }, [router]);

    // Handle Input Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name || '']: e.target.value });
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const shipping = 5.00;
    const total = subtotal + shipping;

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        // Basic Validation
        if (!formData.fullName || !formData.streetAddress || !formData.phoneNumber || !formData.province || !formData.district) {
            toast.error("Please fill in all required delivery details");
            return;
        }

        setLoading(true);
        try {
            // 1. Create Shipping Address
            // Note: Backend might require a specific structure. Assuming standard here.
            const addressResponse = await orderService.createShippingAddress({
                fullName: formData.fullName,
                streetAddress: formData.streetAddress, // Assuming backend maps this correctly
                province: formData.province,
                district: formData.district,
                postalCode: formData.postalCode,
                phoneNumber: formData.phoneNumber,
                // userId is handled by backend token
            });

            if (!addressResponse || !addressResponse.id) {
                throw new Error("Failed to save delivery address");
            }

            // 2. Create Order
            const orderPayload: any = {
                details: cart.map(item => ({
                    productId: Number(item.id),
                    quantity: item.quantity || 1
                })),
                paymentTypeId: paymentMethod === 'cod' ? 1 : 2, // 1=COD, 2=Bank (Adjust ID based on backend DB)
                shippingAddressId: addressResponse.id,
                tax: 0,
                // Backend calculates subtotal/total but we can send estimates if needed
                couponCode: discountCode || undefined
            };

            const orderResponse = await orderService.createOrder(orderPayload);

            toast.success("Order placed successfully!");
            clearCart();
            // Redirect to success page or orders list
            router.push(`/account/orders`); // Or specific success page

        } catch (error: any) {
            console.error("Checkout Error:", error);
            const msg = error.response?.data?.message || "Failed to place order. Please try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-[180px] pb-12 relative z-0">
            {/* Spacer to force content down if padding fails on some viewports */}
            <div className="h-[150px] w-full block" aria-hidden="true" />

            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>

                <div className="space-y-8">
                    {/* Delivery Address Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-6">Delivery Address</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Street Address *</label>
                                <input
                                    type="text"
                                    name="streetAddress"
                                    value={formData.streetAddress}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Street address"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Province *</label>
                                    <input
                                        type="text"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Province"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">District *</label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                        placeholder="District"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Postal Code"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    name="emailAddress"
                                    value={formData.emailAddress}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Optional for order updates"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Section (Down Side) */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-6">Order summary</h2>

                        {/* Cart Items */}
                        <div className="space-y-4 mb-6 border-b pb-6">
                            {cart.length > 0 ? (
                                cart.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-12 h-12 bg-white rounded border overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200" />
                                                )}
                                                <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <span className="font-medium text-sm text-gray-900">{item.name}</span>
                                        </div>
                                        <span className="font-medium text-sm">Rs. {(item.price * (item.quantity || 1)).toFixed(2)}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center text-sm">Your cart is empty.</p>
                            )}
                        </div>

                        {/* Discount Code */}
                        <div className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                placeholder="Discount code or gift card"
                                className="flex-1 p-2 border rounded-md text-sm"
                            />
                            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md font-medium text-sm hover:bg-gray-200 transition-colors">
                                Apply
                            </button>
                        </div>

                        {/* Totals */}
                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">Rs. {shipping.toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between items-center">
                                <span className="font-bold text-gray-900 text-lg">Total</span>
                                <span className="font-bold text-[#3BB77E] text-xl">Rs. {total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="space-y-3 mb-8">
                            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="bank"
                                    checked={paymentMethod === 'bank'}
                                    onChange={() => setPaymentMethod('bank')}
                                    className="w-4 h-4 text-[#3BB77E] focus:ring-[#3BB77E]"
                                />
                                <span className="font-medium">Bank</span>
                            </label>
                            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                    className="w-4 h-4 text-[#3BB77E] focus:ring-[#3BB77E]"
                                />
                                <span className="font-medium">Cash on delivery</span>
                            </label>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className={`w-full bg-[#00028C] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#00026e] transition-colors shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Processing...' : 'Continue to pay'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
