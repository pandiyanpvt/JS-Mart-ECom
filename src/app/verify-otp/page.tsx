"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams?.get("email") || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length === 6) {
            // Handle OTP verification logic here
            console.log("Verify OTP:", otpCode);
            // Navigate to reset password or success page
            router.push("/reset-password");
        }
    };

    const handleResend = () => {
        setTimer(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        console.log("Resending OTP to:", email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
            <div className="w-full max-w-md space-y-8">
                {/* Back Button */}
                <Link
                    href="/forgot-password"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="font-medium">Back</span>
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
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Verify Your Email</h1>
                    <p className="text-gray-600 mt-2 text-center">
                        We've sent a 6-digit code to
                        <br />
                        <span className="font-medium text-gray-900">{email || "your email"}</span>
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
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
                                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 focus:border-lime-500 focus:ring-lime-500 rounded-lg"
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
                                        className="text-sm font-medium text-lime-600 hover:text-lime-700"
                                    >
                                        Resend Code
                                    </button>
                                ) : (
                                    <p className="text-sm text-gray-600">
                                        Resend code in{" "}
                                        <span className="font-semibold text-gray-900">
                                            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Verify Button */}
                        <Button
                            type="submit"
                            disabled={otp.some((digit) => !digit)}
                            className="w-full h-12 bg-lime-500 hover:bg-lime-600 text-white font-semibold text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Verify & Continue
                        </Button>

                        {/* Help Text */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-blue-900">Security Tip</p>
                                    <p className="text-xs text-blue-700">
                                        Never share this code with anyone. Our team will never ask for your
                                        verification code.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Wrong Email */}
                        <p className="text-center text-sm text-gray-600">
                            Wrong email?{" "}
                            <Link
                                href="/forgot-password"
                                className="font-medium text-lime-600 hover:text-lime-700"
                            >
                                Change email address
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
