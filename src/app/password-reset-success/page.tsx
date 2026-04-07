"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { AuthFormCornerLogo, AuthHeroCornerLogo } from "@/components/layout/auth-page-logo";
import { AuthSplitLayout } from "@/components/layout/auth-split-layout";

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
        <AuthSplitLayout>
            {/* Left Side - Image */}
            <div className="relative hidden md:block w-full min-h-[280px] md:min-h-screen h-full bg-[#CBE4E8] animate-[fadeIn_1s_ease-out]">
                <AuthHeroCornerLogo />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src="/Loginnew.png"
                        alt="Fresh groceries in a shopping cart"
                        fill
                        className="object-cover object-center hover:scale-105 transition-transform duration-700"
                        priority
                    />
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center px-8 py-12 md:px-10 lg:px-14 xl:px-16 2xl:px-20 bg-white relative animate-[slideInRight_0.8s_ease-out]">
                <AuthFormCornerLogo />
                <div className="w-full max-w-md xl:max-w-lg mx-auto space-y-8">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#DB4444]/20 rounded-full blur-2xl animate-pulse"></div>
                            <div className="relative w-20 h-20 bg-[#DB4444] rounded-full flex items-center justify-center">
                                <CheckCircle className="h-12 w-12 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="text-center space-y-3">
                        <h1 className="text-2xl font-bold text-black">Password Reset Successful!</h1>
                        <p className="text-black/60">
                            Your password has been successfully reset. You can now log in with your new
                            password.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <Button
                            onClick={() => router.push("/signin")}
                            className="w-full h-12 bg-[#DB4444] hover:bg-[#c93f3f] text-white font-medium text-base rounded shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Continue to Login
                        </Button>
                        <Button
                            onClick={() => router.push("/")}
                            variant="outline"
                            className="w-full h-12 border border-black/20 text-black font-medium hover:bg-gray-50 hover:text-black transition-all duration-300"
                        >
                            Back to Home
                        </Button>
                    </div>

                    {/* Auto Redirect Notice */}
                    <p className="text-center text-sm text-gray-500">
                        Redirecting to login page in 5 seconds...
                    </p>
                </div>
            </div>
        </AuthSplitLayout>
    );
}
