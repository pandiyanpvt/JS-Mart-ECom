"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
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
        <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
            {/* Left Side - Image */}
            <div className="relative hidden md:block w-full h-full bg-[#CBE4E8] animate-[fadeIn_1s_ease-out]">
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src="/auth-image.png"
                        alt="Shopping Illustration"
                        fill
                        className="object-cover object-center hover:scale-105 transition-transform duration-700"
                        priority
                    />
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center px-8 md:px-24 py-12 bg-white relative animate-[slideInRight_0.8s_ease-out]">
                <div className="w-full max-w-md mx-auto space-y-8">
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
                            Your password has been successfully reset. You can now sign in with your new
                            password.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <Button
                            onClick={() => router.push("/signin")}
                            className="w-full h-12 bg-[#DB4444] hover:bg-[#c93f3f] text-white font-medium text-base rounded shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Continue to Sign In
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
                        Redirecting to sign in page in 5 seconds...
                    </p>
                </div>
            </div>
        </div>
    );
}
