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
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
            <div className="w-full max-w-md space-y-8">
                {/* Back Button */}
                <Link
                    href="/signin"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="font-medium">Back to Sign In</span>
                </Link>

                {/* Logo and Header */}
                <div className="flex flex-col items-center">
                    <Link href="/" className="flex items-center gap-2 group mb-2">
                        <div className="relative h-20 w-24 flex items-center justify-center">
                            <Image
                                src="/logo.png"
                                alt="JS Mart Australia Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Forgot Password?</h1>
                    <p className="text-gray-600 mt-2 text-center">
                        No worries! Enter your email and we'll send you a reset code
                    </p>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
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
                                className="w-full h-12 bg-lime-500 hover:bg-lime-600 text-white font-semibold text-base"
                            >
                                Continue to Verification
                            </Button>

                            <p className="text-center text-sm text-gray-600">
                                Didn't receive the code?{" "}
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="font-medium text-lime-600 hover:text-lime-700"
                                >
                                    Resend
                                </button>
                            </p>
                        </div>
                    ) : (
                        /* Form */
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 border-gray-300 focus:border-lime-500 focus:ring-lime-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 bg-lime-500 hover:bg-lime-600 text-white font-semibold text-base"
                            >
                                Send Reset Code
                            </Button>

                            {/* Alternative Options */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500">Or</span>
                                    </div>
                                </div>

                                <Link
                                    href="/signin"
                                    className="block text-center text-sm font-medium text-gray-600 hover:text-gray-900"
                                >
                                    Try signing in again
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
