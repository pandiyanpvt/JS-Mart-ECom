"use client";

import React from "react";
import MembershipPlans from "@/components/membership-plans";
import PageHero from "@/components/page-hero";
import { Star, Crown, Zap } from "lucide-react";

export default function MembershipPage() {
    return (
        <main className="min-h-screen bg-white">
            <PageHero
                image="/images/headers/about-header.png"
                imageAlt="Membership Plans"
                title="Choose Your Membership"
                subtitle="Unlock exclusive benefits and savings with our membership plans"
                align="center"
            />

            <div className="bg-gray-50/50 border-b border-gray-100">
                <MembershipPlans />
            </div>

            <section className="w-full py-16 md:py-24 bg-white">
                <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl md:text-4xl font-black text-[#253D4E] mb-4">
                            Why Choose JS Mart Membership?
                        </h3>
                        <p className="text-gray-500 max-w-2xl mx-auto font-medium">
                            Join our community and enjoy premium benefits designed to make your shopping experience exceptional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        <div className="flex flex-col items-center group">
                            <div className="w-20 h-20 bg-[#005000]/10 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300">
                                <Star className="w-10 h-10 text-[#005000]" />
                            </div>
                            <h4 className="text-xl font-bold text-[#253D4E] mb-3">Exclusive Offers</h4>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Access to member-only deals, early bird sales, and specialized discounts tailored just for you.
                            </p>
                        </div>

                        <div className="flex flex-col items-center group">
                            <div className="w-20 h-20 bg-[#005000]/10 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300">
                                <Zap className="w-10 h-10 text-[#005000]" />
                            </div>
                            <h4 className="text-xl font-bold text-[#253D4E] mb-3">Faster Delivery</h4>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Priority processing and free express delivery options to get your favorites to your doorstep faster.
                            </p>
                        </div>

                        <div className="flex flex-col items-center group">
                            <div className="w-20 h-20 bg-[#005000]/10 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300">
                                <Crown className="w-10 h-10 text-[#005000]" />
                            </div>
                            <h4 className="text-xl font-bold text-[#253D4E] mb-3">Premium Support</h4>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Dedicated customer service line and priority assistance for any inquiries or returns.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
