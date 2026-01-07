"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function PasswordResetSuccessPage() {
    const router = useRouter();

    useEffect(() => {
        // Auto redirect after 5 seconds
        const timeout = setTimeout(() => {
            router.push("/signin");
        }, 5000);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-emerald-50 via-emerald-50 to-green-50">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
                            <div className="relative w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-12 w-12 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="flex justify-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative flex items-center justify-center p-1">
                                <div className="relative h-10 w-10 flex items-center justify-center">
                                    <ShoppingBag className="h-8 w-8 text-emerald-500 fill-lime-500 absolute" />
                                    <span className="relative z-10 text-[10px] font-bold text-white pt-2">JS</span>
                                </div>
                                <span className="text-2xl font-bold text-gray-900 tracking-tight">mart</span>
                            </div>
                        </Link>
                    </div>

                    {/* Success Message */}
                    <div className="text-center space-y-3">
                        <h1 className="text-2xl font-bold text-gray-900">Password Reset Successful!</h1>
                        <p className="text-gray-600">
                            Your password has been successfully reset. You can now sign in with your new
                            password.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Button
                            onClick={() => router.push("/signin")}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base"
                        >
                            Continue to Sign In
                        </Button>
                        <Button
                            onClick={() => router.push("/")}
                            variant="outline"
                            className="w-full h-12 border-gray-300 text-gray-600 hover:bg-gray-50 font-medium"
                        >
                            Back to Home
                        </Button>
                    </div>

                    {/* Auto Redirect Notice */}
                    <p className="text-center text-sm text-gray-500">
                        Redirecting to sign in page in 5 seconds...
                    </p>
                </div>
            </div>
        </div>
    );
}
