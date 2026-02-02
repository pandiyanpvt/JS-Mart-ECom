"use client";

import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ArrowLeft, Eye, EyeOff} from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        emailOrPhone: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle sign in logic here
        console.log("Sign in with:", formData);

        // Store user session
        localStorage.setItem("user", JSON.stringify({email: formData.emailOrPhone}));

        // Redirect to account dashboard
        router.push("/account");
    };
    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/account" });
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
            <div
                className="flex flex-col justify-center px-8 md:px-24 py-12 bg-white relative animate-[slideInRight_0.8s_ease-out]">
                <Button
                    variant="ghost"
                    className="absolute top-8 left-8 md:top-12 md:left-12 hover:bg-gray-100/80 transition-all duration-300"
                    asChild
                >
                    <Link href="/">
                        <ArrowLeft/>
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
                                onChange={(e) => setFormData({...formData, emailOrPhone: e.target.value})}
                                className="border-0 border-b border-gray-300 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-[#DB4444] placeholder:text-gray-400 h-auto text-base transition-colors duration-300"
                                required
                            />
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="border-0 border-b border-gray-300 rounded-none px-0 pr-8 py-2 focus-visible:ring-0 focus-visible:border-[#DB4444] placeholder:text-gray-400 h-auto text-base transition-colors duration-300 w-full"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5"/>
                                    ) : (
                                        <Eye className="h-5 w-5"/>
                                    )}
                                </button>
                            </div>
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
                        {/* Divider */}
                        <div className="flex items-center gap-4 py-4">
                            <div className="h-px flex-1 bg-gray-200"/>
                            <span className="text-sm text-gray-400">Or, login with</span>
                            <div className="h-px flex-1 bg-gray-200"/>
                        </div>

                        {/* Social Login */}
                        <div className="flex justify-center gap-6">
                            {/* Google */}
                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    onClick={() => handleGoogleLogin()}*/}
                            {/*    className="flex items-center gap-2 border rounded-md px-4 py-2 hover:bg-gray-50 transition"*/}
                            {/*>*/}
                            {/*    <Image src="/logo/google-icon.svg"*/}
                            {/*           alt="Google" width={20} height={20}/>*/}
                            {/*    <span className="text-sm">Google</span>*/}
                            {/*</button>*/}
                            <Button
                                onClick={() => handleGoogleLogin()}
                                type="button"
                                variant="outline"
                                className="w-full h-12 border border-gray-300 text-gray-700 font-medium text-base rounded flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors duration-300"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Sign in with Google
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
