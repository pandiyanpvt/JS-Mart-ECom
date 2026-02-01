"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle forgot password logic here
        console.log("Reset password for:", email);
        // Navigate to OTP page
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    };

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
                <Button
                    variant="ghost"
                    className="absolute top-8 left-8 md:top-12 md:left-12 hover:bg-gray-100/80 transition-all duration-300"
                    asChild
                >
                    <Link href="/signin">
                        <ArrowLeft />
                        Back to Sign In
                    </Link>
                </Button>
                <div className="w-full max-w-md mx-auto space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-medium tracking-wide text-black">
                            Forgot Password?
                        </h1>
                        <p className="text-black/60 text-base">
                            No worries! Enter your email and we'll send you a reset code
                        </p>
                    </div>

                    {isSubmitted ? (
                        /* Success Message */
                        <div className="space-y-6">
                            <div className="bg-lime-50 border border-lime-200 rounded-lg p-6 space-y-4">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center">
                                        <Mail className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-900">Check Your Email</h3>
                                    <p className="text-sm text-gray-600">
                                        We've sent a 6-digit verification code to
                                        <br />
                                        <span className="font-medium text-gray-900">{email}</span>
                                    </p>
                                </div>
                            </div>

                            <Button
                                onClick={() => router.push(`/verify-otp?email=${encodeURIComponent(email)}`)}
                                className="w-full h-12 bg-[#DB4444] hover:bg-[#c93f3f] text-white font-medium text-base rounded shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Continue to Verification
                            </Button>

                            <p className="text-center text-sm text-gray-600">
                                Didn't receive the code?{" "}
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="font-medium text-[#DB4444] hover:underline"
                                >
                                    Resend
                                </button>
                            </p>
                        </div>
                    ) : (
                        /* Form */
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-6">
                                <Input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border-0 border-b border-gray-300 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-[#DB4444] placeholder:text-gray-400 h-auto text-base transition-colors duration-300"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-[#DB4444] hover:bg-[#c93f3f] text-white font-medium text-base rounded shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Send Reset Code
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-gray-600">
                                <span>Remember your password?</span>
                                <Link
                                    href="/signin"
                                    className="text-black font-medium border-b border-black/50 hover:border-black pb-0.5 leading-none transition-colors"
                                >
                                    Log in
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
