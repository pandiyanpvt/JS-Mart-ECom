"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        emailOrPhone: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle sign in logic here
        console.log("Sign in with:", formData);

        // Store user session
        localStorage.setItem("user", JSON.stringify({ email: formData.emailOrPhone }));

        // Redirect to account dashboard
        router.push("/account");
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
                    <Link href="/">
                        <ArrowLeft />
                        Back
                    </Link>
                </Button>
                <div className="w-full max-w-md mx-auto space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-medium tracking-wide text-black">
                            Log in to JS Mart
                        </h1>
                        <p className="text-black/60 text-base">
                            Enter your details below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-6">
                            <Input
                                type="text"
                                placeholder="Email or Phone Number"
                                value={formData.emailOrPhone}
                                onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                                className="border-0 border-b border-gray-300 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-[#DB4444] placeholder:text-gray-400 h-auto text-base transition-colors duration-300"
                                required
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="border-0 border-b border-gray-300 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-[#DB4444] placeholder:text-gray-400 h-auto text-base transition-colors duration-300"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            {/* Placeholder for alignment or remember me if needed */}
                            <div></div>
                            <Link
                                href="/forgot-password"
                                className="text-[#DB4444] text-sm font-light hover:underline transition-all"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <div className="space-y-4 pt-2">
                            <Button
                                type="submit"
                                className="w-full h-12 bg-[#DB4444] hover:bg-[#c93f3f] text-white font-medium text-base rounded shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Log In
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-gray-600">
                            <span>Don't have an account?</span>
                            <Link
                                href="/signup"
                                className="text-black font-medium border-b border-black/50 hover:border-black pb-0.5 leading-none transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
