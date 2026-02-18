"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, ShoppingCart, ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";

const PaymentCancelContent = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="py-12 md:py-20 bg-[#fffaf8] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
                <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-orange-500 blur-3xl" />
                <div className="absolute bottom-[10%] right-[5%] w-96 h-96 rounded-full bg-red-500 blur-3xl" />
            </div>

            <div className="max-w-lg w-full relative z-10">
                {/* Cancel Card */}
                <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(255,100,0,0.08)] border border-orange-50 overflow-hidden">
                    {/* Top Banner */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-12 text-center relative overflow-hidden">
                        {/* Decorative Circles */}
                        <div className="absolute top-[-20%] left-[-10%] w-40 h-40 rounded-full bg-white/10" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-56 h-56 rounded-full bg-white/10" />

                        <div className="relative">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse-slow">
                                <XCircle className="w-14 h-14 text-red-500" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Payment Cancelled</h1>
                            <p className="text-orange-50 text-sm font-medium">Your request has been interrupted</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="px-8 pt-10 pb-6">
                        <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-4 mb-8">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-orange-600">
                                ⚠️
                            </div>
                            <p className="text-sm text-orange-800 leading-relaxed font-medium">
                                Your order was created but the payment process didn&apos;t finish. You can still pay for it manually or return to checkout.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {orderId && (
                                <div className="flex items-center justify-between py-4 border-b border-gray-50 px-2">
                                    <span className="text-gray-500 font-medium">Reference</span>
                                    <span className="font-bold text-[#253D4E]">#{orderId}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between py-4 px-2">
                                <span className="text-gray-500 font-medium">Current Status</span>
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-700 text-sm font-bold rounded-full border border-orange-100">
                                    <span className="w-2 h-2 bg-orange-400 rounded-full" />
                                    Payment Pending
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-8 pb-10 flex flex-col gap-4">
                        <Link
                            href="/checkout"
                            className="group flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#635bff] hover:bg-[#5a52e8] text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-indigo-900/20 active:scale-[0.98]"
                        >
                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            Retry Secure Payment
                        </Link>
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href="/account/orders"
                                className="flex items-center justify-center gap-2 py-3.5 px-4 border-2 border-gray-100 hover:border-gray-200 text-gray-600 font-bold rounded-xl transition-all hover:bg-gray-50"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                <span className="text-sm">My Orders</span>
                            </Link>
                            <Link
                                href="/shop"
                                className="flex items-center justify-center gap-2 py-3.5 px-4 border-2 border-gray-100 hover:border-gray-200 text-gray-600 font-bold rounded-xl transition-all hover:bg-gray-50"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm">Back to Shop</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 flex items-center justify-center gap-4 text-gray-400">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold">
                        No charges were made to your card
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
                </div>
            </div>
        </div>
    );
};

export default function PaymentCancelPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        }>
            <PaymentCancelContent />
        </Suspense>
    );
}
