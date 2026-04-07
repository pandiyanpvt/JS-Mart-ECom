"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { authService } from "@/services";
import toast from "react-hot-toast";
import { AuthFormCornerLogo, AuthHeroCornerLogo } from "@/components/layout/auth-page-logo";
import { AuthSplitLayout } from "@/components/layout/auth-split-layout";

export default function SignInPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        emailOrPhone: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const syncGoogleLogin = async () => {
            if (status === "authenticated" && session?.user) {
                try {


                    await authService.googleLogin({
                        emailAddress: session.user.email,
                        fullName: session.user.name,
                        profileImg: session.user.image,
                    });

                    // Dispatch event to update navbar
                    window.dispatchEvent(new Event("auth-change"));

                    toast.success("Login successful!");
                    router.push("/");
                } catch (error) {
                    console.error("Error syncing Google login:", error);
                    toast.error("Failed to connect with server");
                }
            }
        };

        syncGoogleLogin();
    }, [session, status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await authService.login({
                emailAddress: formData.emailOrPhone,
                password: formData.password
            });

            toast.success("Login success");
            window.dispatchEvent(new Event("auth-change"));
            router.push("/");
        } catch (err: any) {
            console.error("Login failed", err);
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {

            await signIn("google", {
                callbackUrl: "/",
                redirect: true,
                prompt: "select_account"
            });
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Failed to log in with Google");
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
            <div
                className="flex flex-col justify-center px-8 py-12 md:px-10 lg:px-14 xl:px-16 2xl:px-20 bg-white relative animate-[slideInRight_0.8s_ease-out]">
                <AuthFormCornerLogo />
                <Button
                    variant="ghost"
                    className="absolute top-8 left-6 md:top-12 md:left-12 text-slate-600 hover:bg-gray-100/80 md:hover:bg-slate-100/90 transition-all duration-300 text-sm font-medium gap-2 md:hover:text-[#253D4E]"
                    asChild
                >
                    <Link href="/" aria-label="Back" title="Back">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="w-full max-w-md xl:max-w-lg mx-auto space-y-8">
                    {/* Small screens: original title + subtitle */}
                    <header className="space-y-2 pt-14 md:hidden">
                        <h1 className="text-3xl font-medium tracking-wide text-black">
                            Log in to JS Mart
                        </h1>
                        <p className="text-black/60 text-base">Enter your details below</p>
                    </header>
                    {/* md+: refreshed typography */}
                    <header className="hidden md:block space-y-3 pt-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#005000]">
                            Welcome back
                        </p>
                        <h1 className="text-4xl font-bold tracking-tight text-[#253D4E] leading-[1.15]">
                            Sign in to your account
                        </h1>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div
                                role="alert"
                                className="bg-red-50 md:bg-rose-50 border border-red-200 md:border-rose-100 text-red-600 md:text-rose-700 px-4 py-3 rounded-md md:rounded-xl text-sm font-medium md:leading-snug"
                            >
                                {error}
                            </div>
                        )}

                        {/* Small screens: underline inputs (original style) */}
                        <div className="space-y-6 md:hidden">
                            <Input
                                type="text"
                                placeholder="Email or Phone Number"
                                value={formData.emailOrPhone}
                                onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                                className="border-0 border-b border-gray-300 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-[#DB4444] placeholder:text-gray-400 h-auto text-base transition-colors duration-300"
                                required
                            />
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="border-0 border-b border-gray-300 rounded-none px-0 pr-8 py-2 focus-visible:ring-0 focus-visible:border-[#DB4444] placeholder:text-gray-400 h-auto text-base transition-colors duration-300 w-full"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center justify-end -mt-2">
                                <Link
                                    href="/forgot-password"
                                    className="text-[#DB4444] text-sm font-light hover:underline transition-all"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {/* md+: labeled rounded fields */}
                        <div className="hidden md:block space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="signin-email" className="text-sm font-semibold text-[#253D4E]">
                                    Email or phone
                                </label>
                                <Input
                                    id="signin-email"
                                    type="text"
                                    placeholder="you@example.com or 07xxxxxxxx"
                                    value={formData.emailOrPhone}
                                    onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                                    className="h-12 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-[15px] text-[#253D4E] placeholder:text-slate-400 shadow-sm transition-all focus-visible:border-[#005000] focus-visible:ring-[3px] focus-visible:ring-[#005000]/15 focus-visible:bg-white"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-baseline gap-2">
                                    <label htmlFor="signin-password" className="text-sm font-semibold text-[#253D4E]">
                                        Password
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-semibold text-[#005000] hover:text-[#006600] underline-offset-4 hover:underline transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="signin-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="h-12 rounded-xl border border-slate-200 bg-slate-50/50 pr-11 pl-4 text-[15px] text-[#253D4E] placeholder:text-slate-400 shadow-sm transition-all focus-visible:border-[#005000] focus-visible:ring-[3px] focus-visible:ring-[#005000]/15 focus-visible:bg-white w-full"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#253D4E] focus:outline-none rounded-md p-1"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2 md:pt-1">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-[#DB4444] hover:bg-[#c93f3f] md:bg-[#005000] md:hover:bg-[#006600] text-white font-medium md:font-semibold text-base rounded shadow-md hover:shadow-lg hover:-translate-y-0.5 md:hover:translate-y-0 md:rounded-xl md:shadow-[#005000]/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                <span className="md:hidden">{loading ? "Logging in..." : "Log In"}</span>
                                <span className="hidden md:inline">{loading ? "Signing in…" : "Sign in"}</span>
                            </Button>
                        </div>

                        <p className="flex flex-wrap items-center justify-center gap-1 text-center text-sm text-gray-600 md:text-slate-600">
                            <span>Don&apos;t have an account?</span>
                            <Link
                                href="/signup"
                                className="text-black font-medium border-b border-black/50 hover:border-black pb-0.5 leading-none transition-colors md:border-0 md:pb-0 md:font-semibold md:text-[#005000] md:hover:text-[#006600] md:underline-offset-4 md:hover:underline"
                            >
                                Sign Up
                            </Link>
                        </p>
                        <div className="flex items-center gap-4 py-2 md:py-2">
                            <div className="h-px flex-1 bg-gray-200 md:bg-slate-200" />
                            <span className="text-sm text-gray-400 md:text-[11px] md:font-semibold md:uppercase md:tracking-[0.18em] md:text-slate-400">
                                <span className="md:hidden">Or, login with</span>
                                <span className="hidden md:inline">Or continue with</span>
                            </span>
                            <div className="h-px flex-1 bg-gray-200 md:bg-slate-200" />
                        </div>

                        {/* Social Login */}
                        <div className="flex justify-center gap-6">
                            <Button
                                onClick={() => handleGoogleLogin()}
                                type="button"
                                variant="outline"
                                className="w-full h-12 border border-gray-300 md:border-slate-200 bg-white text-gray-700 md:text-[#253D4E] font-medium md:font-semibold text-base md:text-[15px] rounded md:rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 md:hover:bg-slate-50 md:hover:border-slate-300 transition-colors duration-300 md:shadow-sm"
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
                                <span className="md:hidden">Login with Google</span>
                                <span className="hidden md:inline">Continue with Google</span>
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </AuthSplitLayout>
    );
}
