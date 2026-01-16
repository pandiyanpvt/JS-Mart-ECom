"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        console.log("Reset password:", formData.password);
        router.push("/password-reset-success");
    };

    const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];
    const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
            <div className="w-full max-w-md space-y-8">
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
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Create New Password</h1>
                    <p className="text-gray-600 mt-2 text-center">
                        Your new password must be different from previously used passwords
                    </p>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 font-medium">
                                New Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-emerald-500 focus:ring-lime-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-emerald-500 focus:ring-lime-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                            className="w-full h-12 bg-emerald-500 hover:bg-green-600 text-white font-semibold text-base"
                        >
                            Reset Password
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
