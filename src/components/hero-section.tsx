"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ShoppingCart } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#E8F5E9] via-[#F1F8E9] to-[#E3F2FD] min-h-[600px] flex items-center shadow-xl">
                {/* Decorative Background Elements */}
                <div className="absolute top-10 right-20 w-32 h-32 bg-[#3BB77E]/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#FFA726]/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#42A5F5]/10 rounded-full blur-2xl animate-pulse delay-500" />

                {/* Floating Icons */}
                <div className="absolute top-20 left-10 opacity-20 animate-bounce">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M20 5L25 15L35 17L27 25L29 35L20 30L11 35L13 25L5 17L15 15L20 5Z" fill="#3BB77E" />
                    </svg>
                </div>
                <div className="absolute bottom-32 right-32 opacity-20 animate-bounce delay-700">
                    <ShoppingCart className="w-10 h-10 text-[#FF6B6B]" />
                </div>

                <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center px-8 md:px-16 py-16">
                    {/* Left Content */}
                    <div className="space-y-8 max-w-2xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-[#3BB77E]/20">
                            <span className="w-2 h-2 bg-[#3BB77E] rounded-full animate-pulse"></span>
                            <span className="text-sm font-semibold text-[#253D4E]">Welcome to JS Mart</span>
                        </div>

                        {/* Main Heading */}
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-extrabold text-[#253D4E] leading-[1.1] tracking-tight">
                                Don't miss our
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3BB77E] to-[#2eaa70]">
                                    daily amazing
                                </span>
                                <br />
                                deals.
                            </h1>
                            <p className="text-[#7E7E7E] text-lg md:text-xl font-medium max-w-md">
                                Save up to <span className="text-[#FF6B6B] font-bold">60% off</span> on your first order
                            </p>
                        </div>

                        {/* Email Subscription */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white rounded-full p-2 shadow-lg max-w-md">
                            <div className="relative flex-1 w-full">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="email"
                                    placeholder="Your email address"
                                    className="pl-12 h-12 border-0 focus-visible:ring-0 rounded-full bg-transparent"
                                />
                            </div>
                            <Button className="bg-[#3BB77E] hover:bg-[#2eaa70] text-white font-bold h-12 px-8 rounded-full shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap">
                                Subscribe
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-6 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-[#3BB77E]/10 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#3BB77E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-[#253D4E]">Free Shipping</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-[#253D4E]">Quick Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-[#FFA726]/10 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#FFA726]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-[#253D4E]">100% Organic</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative hidden lg:block">
                        {/* Decorative Circle */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[500px] h-[500px] bg-gradient-to-br from-[#3BB77E]/20 to-transparent rounded-full blur-2xl"></div>
                        </div>

                        {/* Main Image */}
                        <div className="relative aspect-square w-full max-w-[550px] ml-auto transform hover:scale-105 transition-transform duration-700 ease-out">
                            <Image
                                src="/vegetables_bag_hero.png"
                                alt="Fresh Vegetables"
                                fill
                                className="object-contain drop-shadow-[0_20px_50px_rgba(59,183,126,0.3)]"
                                priority
                            />
                        </div>

                        {/* Floating Price Badge */}
                        <div className="absolute top-10 right-10 bg-white rounded-2xl shadow-xl p-4 animate-bounce">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 font-medium">Starting at</p>
                                <p className="text-2xl font-bold text-[#3BB77E]">$29.99</p>
                            </div>
                        </div>

                        {/* Floating Discount Badge */}
                        <div className="absolute bottom-20 left-0 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white rounded-2xl shadow-xl p-4 animate-pulse">
                            <div className="text-center">
                                <p className="text-3xl font-bold">50%</p>
                                <p className="text-xs font-medium">OFF</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="h-2 w-8 rounded-full bg-[#3BB77E] shadow-sm transition-all" />
                    <div className="h-2 w-2 rounded-full bg-[#3BB77E]/30 shadow-sm cursor-pointer hover:bg-[#3BB77E]/50 transition-all hover:w-8" />
                    <div className="h-2 w-2 rounded-full bg-[#3BB77E]/30 shadow-sm cursor-pointer hover:bg-[#3BB77E]/50 transition-all hover:w-8" />
                </div>
            </div>
        </section>
    );
}
