"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFormCornerLogo, AuthHeroCornerLogo } from "@/components/layout/auth-page-logo";
import { AuthSplitLayout } from "@/components/layout/auth-split-layout";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [passwordStrength, setPasswordStrength] = useState(0);

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        return strength;
    };

    const handlePasswordChange = (password: string) => {
        setFormData({ ...formData, password });
        setPasswordStrength(calculatePasswordStrength(password));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        // Handle reset password logic here

        router.push("/password-reset-success");
    };

    const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];
    const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

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
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-medium tracking-wide text-black">
                            Create New Password
                        </h1>
                        <p className="text-black/60 text-base">
                            Your new password must be different from previously used passwords
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div className="space-y-6">
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    value={formData.password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    className="border-0 border-b border-gray-300 rounded-none px-0 pr-8 py-2 focus-visible:ring-0 focus-visible:border-[#DB4444] placeholder:text-gray-400 h-auto text-base transition-colors duration-300 w-full"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="space-y-2">
                                    <div className="flex gap-1">
                                        {[0, 1, 2, 3].map((index) => (
                                            <div
                                                key={index}
                                                className={`h-1 flex-1 rounded-full transition-colors ${index < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-gray-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    {passwordStrength > 0 && (
                                        <p className="text-xs text-gray-600">
                                            Password strength:{" "}
                                            <span
                                                className={`font-semibold ${passwordStrength === 4
                                                    ? "text-green-600"
                                                    : passwordStrength === 3
                                                        ? "text-yellow-600"
                                                        : passwordStrength === 2
                                                            ? "text-orange-600"
                                                            : "text-red-600"
                                                    }`}
                                            >
                                                {strengthLabels[passwordStrength - 1]}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Confirm Password */}
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="border-0 border-b border-gray-300 rounded-none px-0 pr-8 py-2 focus-visible:ring-0 focus-visible:border-[#DB4444] placeholder:text-gray-400 h-auto text-base transition-colors duration-300 w-full"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <p className="text-sm font-medium text-gray-700">Password must contain:</p>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2
                                        className={`h-4 w-4 ${formData.password.length >= 8 ? "text-green-600" : "text-gray-300"
                                            }`}
                                    />
                                    <span className={formData.password.length >= 8 ? "text-gray-700" : "text-gray-500"}>
                                        At least 8 characters
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2
                                        className={`h-4 w-4 ${/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password)
                                            ? "text-green-600"
                                            : "text-gray-300"
                                            }`}
                                    />
                                    <span
                                        className={
                                            /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password)
                                                ? "text-gray-700"
                                                : "text-gray-500"
                                        }
                                    >
                                        Upper & lowercase letters
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2
                                        className={`h-4 w-4 ${/\d/.test(formData.password) ? "text-green-600" : "text-gray-300"}`}
                                    />
                                    <span className={/\d/.test(formData.password) ? "text-gray-700" : "text-gray-500"}>
                                        At least one number
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2
                                        className={`h-4 w-4 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                                            ? "text-green-600"
                                            : "text-gray-300"
                                            }`}
                                    />
                                    <span
                                        className={
                                            /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                                                ? "text-gray-700"
                                                : "text-gray-500"
                                        }
                                    >
                                        Special character (!@#$%^&*)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#DB4444] hover:bg-[#c93f3f] text-white font-medium text-base rounded shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Reset Password
                        </Button>
                    </form>
                </div>
            </div>
        </AuthSplitLayout>
    );
}
