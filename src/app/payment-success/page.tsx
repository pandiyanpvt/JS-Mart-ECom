"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, ShoppingBag, ArrowRight, Home } from "lucide-react";
import { useCart } from "@/context/CartContext";
import api from "@/services/apiClient";
import Cookies from "js-cookie";

const PaymentSuccessContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { clearCart } = useCart();

    const sessionId = searchParams.get("session_id");
    const orderId = searchParams.get("orderId");

    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [orderDetails, setOrderDetails] = useState<{ amount?: number; currency?: string } | null>(null);
    const [verifiedOrderId, setVerifiedOrderId] = useState<string | null>(null);

    useEffect(() => {
        const verify = async () => {
            if (!sessionId) {
                setStatus("failed");
                return;
            }

            const token = Cookies.get("token");
            if (!token) {
                router.replace("/signin");
                return;
            }

            try {
                const response = await api.get(`/payment/verify-session?session_id=${sessionId}`);
                const data = response.data;

                if (data.status === "paid") {
                    setStatus("success");
                    setOrderDetails({ amount: data.amount, currency: data.currency });
                    if (data.orderId) setVerifiedOrderId(data.orderId.toString());
                    clearCart(); // Clear cart only after confirmed payment
                } else {
                    setStatus("failed");
                }
            } catch (err) {
                console.error("Payment verification failed:", err);
                setStatus("failed");
            }
        };

        verify();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-75" />
                        <div className="relative w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center">
                            <Loader2 className="w-10 h-10 text-white animate-spin" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
                    <p className="text-gray-500">Please wait while we confirm your payment with Stripe...</p>
                </div>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-14 h-14 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">Payment Failed</h1>
                    <p className="text-gray-600 mb-2">
                        We couldn&apos;t verify your payment. Your order may not have been processed.
                    </p>
                    {orderId && (
                        <p className="text-sm text-gray-500 mb-8">Order reference: <span className="font-semibold">#{orderId}</span></p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/checkout"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
                        >
                            Try Again
                        </Link>
                        <Link
                            href="/account/orders"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
                        >
                            View Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 md:py-20 bg-[#f8fcf8] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
                <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-[#005000] blur-3xl" />
                <div className="absolute bottom-[10%] right-[5%] w-96 h-96 rounded-full bg-emerald-500 blur-3xl" />
            </div>

            <div className="max-w-lg w-full relative z-10">
                {/* Success Card */}
                <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,80,0,0.1)] border border-green-50 overflow-hidden">
                    {/* Top Banner */}
                    <div className="bg-[#005000] px-8 py-12 text-center relative overflow-hidden">
                        {/* Decorative Circles */}
                        <div className="absolute top-[-20%] left-[-10%] w-40 h-40 rounded-full bg-white/5" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-56 h-56 rounded-full bg-white/5" />

                        <div className="relative">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce-slow">
                                <CheckCircle className="w-14 h-14 text-[#005000]" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Payment Successful!</h1>
                            <p className="text-green-100/80 text-sm font-medium">Thank you for your purchase</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="px-8 pt-10 pb-6">
                        <div className="space-y-4">
                            {(verifiedOrderId || orderId) && (
                                <div className="flex items-center justify-between py-4 border-b border-gray-50 group hover:bg-gray-50/50 transition-colors px-2 rounded-lg">
                                    <span className="text-gray-500 font-medium">Order Number</span>
                                    <span className="font-bold text-[#253D4E] text-lg">#{verifiedOrderId || orderId}</span>
                                </div>
                            )}
                            {orderDetails?.amount && (
                                <div className="flex items-center justify-between py-4 border-b border-gray-50 group hover:bg-gray-50/50 transition-colors px-2 rounded-lg">
                                    <span className="text-gray-500 font-medium">Amount Paid</span>
                                    <span className="font-black text-[#005000] text-xl">
                                        {(orderDetails.currency || "aud").toUpperCase()} {(orderDetails.amount / 100).toFixed(2)}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between py-4 border-b border-gray-100 group hover:bg-gray-50/50 transition-colors px-2 rounded-lg">
                                <span className="text-gray-500 font-medium">Payment Method</span>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <span className="font-bold text-indigo-600">Stripe Secure</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-4 px-2">
                                <span className="text-gray-500 font-medium">Order Status</span>
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-bold rounded-full border border-amber-100">
                                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                    Pending
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-blue-600">
                                📧
                            </div>
                            <p className="text-sm text-blue-800 leading-relaxed font-medium">
                                We&apos;ve sent a confirmation email to you. You can track your shipment details in the orders section.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-8 pb-10 flex flex-col gap-4">
                        <Link
                            href="/account/orders"
                            className="group flex items-center justify-between w-full py-4 px-6 bg-[#005000] hover:bg-[#003d00] text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-green-900/20 active:scale-[0.98]"
                        >
                            <span className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5" />
                                Track My Order
                            </span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/shop"
                            className="flex items-center justify-center gap-2 w-full py-4 text-[#253D4E] font-bold hover:text-[#005000] transition-colors rounded-2xl border-2 border-transparent hover:bg-green-50/50"
                        >
                            <Home className="w-5 h-5" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 flex items-center justify-center gap-4 text-gray-400">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold">
                        Securely processed by <span className="text-indigo-400">Stripe</span>
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
                </div>
            </div>
        </div>
    );
};

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
