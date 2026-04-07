"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services";
import { AuthFormCornerLogo, AuthHeroCornerLogo } from "@/components/layout/auth-page-logo";
import { AuthSplitLayout } from "@/components/layout/auth-split-layout";

function VerifyOTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams?.get("email") || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
        const newOtp = [...otp];
        pastedData.forEach((char, index) => {
            if (index < 6 && /^\d$/.test(char)) {
                newOtp[index] = char;
            }
        });
        setOtp(newOtp);
        const lastFilledIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastFilledIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length !== 6) return;

        setError("");
        setLoading(true);

        try {
            await authService.verifyOtp({
                emailAddress: email,
                otp: otpCode
            });
            // Verification successful, redirect to login
            router.push("/signin");
        } catch (err: any) {
            console.error("Verification failed", err);
            setError(err.response?.data?.message || "Invalid OTP or expired. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setTimer(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        setError("");

        try {
            await authService.resendOtp(email);
        } catch (err) {
            console.error("Failed to resend otp", err);
            setError("Failed to resend OTP");
        }
    };

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
                <Button
                    variant="ghost"
                    className="absolute top-8 left-8 md:top-12 md:left-12 hover:bg-gray-100/80 transition-all duration-300"
                    asChild
                >
                    <Link href="/signup">
                        <ArrowLeft />
                        Back
                    </Link>
                </Button>
                <div className="w-full max-w-md xl:max-w-lg mx-auto space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-medium tracking-wide text-black">
                            Verify Your Email
                        </h1>
                        <p className="text-black/60 text-base">
                            We've sent a 6-digit code to <span className="font-medium text-black">{email || "your email"}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        {/* OTP Input */}
                        <div className="space-y-4">
                            <div className="flex justify-center gap-3">
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className="w-12 h-14 text-center text-2xl font-bold border-0 border-b-2 border-gray-300 focus-visible:border-[#DB4444] rounded-none focus-visible:ring-0"
                                        required
                                    />
                                ))}
                            </div>

                            {/* Timer */}
                            <div className="text-center">
                                {canResend ? (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        className="text-sm font-medium text-[#DB4444] hover:underline"
                                    >
                                        Resend Code
                                    </button>
                                ) : (
                                    <p className="text-sm text-gray-600">
                                        Resend code in{" "}
                                        <span className="font-semibold text-black">
                                            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Verify Button */}
                        <Button
                            type="submit"
                            disabled={otp.some((digit) => !digit) || loading}
                            className="w-full h-12 bg-[#DB4444] hover:bg-[#c93f3f] text-white font-medium text-base rounded shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {loading ? "Verifying..." : "Verify & Continue"}
                        </Button>

                        {/* Help Text */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <Shield className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-900">Security Tip</p>
                                    <p className="text-xs text-gray-700">
                                        Never share this code with anyone. Our team will never ask for your
                                        verification code.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Wrong Email */}
                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                            <span>Wrong email?</span>
                            <Link
                                href="/signup"
                                className="text-black font-medium border-b border-black/50 hover:border-black pb-0.5 leading-none transition-colors"
                            >
                                Change email address
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthSplitLayout>
    );
}

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerifyOTPContent />
        </Suspense>
    );
}
