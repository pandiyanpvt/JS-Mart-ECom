"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Star, Crown, Zap } from "lucide-react";
import PageHero from "@/components/page-hero";

export default function MembershipPage() {
    const membershipPlans = [
        {
            id: 1,
            name: "Regular",
            level: 0,
            price: "Free",
            description: "Standard shopping experience",
            features: [
                "Access to all products",
                "Standard delivery",
                "Regular offers",
                "Customer support"
            ],
            color: "bg-gray-100 text-gray-800",
            borderColor: "border-gray-300"
        },
        {
            id: 2,
            name: "Pro+",
            level: 1,
            price: "$9.99/month",
            description: "Enhanced benefits for frequent shoppers",
            features: [
                "All Regular benefits",
                "5% discount on all orders",
                "Priority delivery",
                "Exclusive Pro+ offers",
                "Early access to sales",
                "Dedicated support"
            ],
            color: "bg-[#005000] text-white",
            borderColor: "border-[#005000]",
            popular: true
        },
        {
            id: 3,
            name: "Plus+",
            level: 2,
            price: "$19.99/month",
            description: "Premium experience with maximum benefits",
            features: [
                "All Pro+ benefits",
                "10% discount on all orders",
                "Free express delivery",
                "Exclusive Plus+ offers",
                "VIP customer support",
                "Birthday rewards",
                "Special event access"
            ],
            color: "bg-gradient-to-br from-[#005000] to-[#003d00] text-white",
            borderColor: "border-[#005000]",
            premium: true
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <PageHero
                image="/images/headers/about-header.png"
                imageAlt="Membership Plans"
                title="Choose Your Membership"
                subtitle="Unlock exclusive benefits and savings with our membership plans"
                align="center"
            />

            <section className="w-full py-16 md:py-20 bg-gray-50">
                <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#253D4E] mb-4">
                            Membership Plans
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Select the plan that best fits your shopping needs and enjoy exclusive benefits
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {membershipPlans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`bg-white rounded-2xl border-2 ${plan.borderColor} shadow-lg overflow-hidden relative ${plan.popular ? "md:scale-105 md:z-10" : ""}`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-0 right-0 bg-[#005000] text-white text-center py-2 text-sm font-bold">
                                        MOST POPULAR
                                    </div>
                                )}
                                {plan.premium && (
                                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-center py-2 text-sm font-bold flex items-center justify-center gap-2">
                                        <Crown className="w-4 h-4" />
                                        PREMIUM
                                    </div>
                                )}

                                <div className={`p-8 ${plan.popular || plan.premium ? "pt-16" : ""}`}>
                                    <div className="text-center mb-6">
                                        <h3 className="text-2xl font-bold text-[#253D4E] mb-2">{plan.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                                        <div className="text-4xl font-extrabold text-[#005000] mb-2">
                                            {plan.price}
                                        </div>
                                    </div>

                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular || plan.premium ? "text-[#005000]" : "text-gray-400"}`} />
                                                <span className="text-gray-700 text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href="/signup" className="block">
                                        <Button
                                            className={`w-full h-12 font-bold rounded-lg transition-all ${
                                                plan.popular || plan.premium
                                                    ? "bg-[#005000] hover:bg-[#006600] text-white"
                                                    : "bg-gray-100 hover:bg-gray-200 text-[#253D4E]"
                                            }`}
                                        >
                                            {plan.level === 0 ? "Continue Shopping" : "Get Started"}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <h3 className="text-2xl font-bold text-[#253D4E] mb-6">Why Choose JS Mart Membership?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-[#005000]/10 rounded-full flex items-center justify-center mb-4">
                                    <Star className="w-8 h-8 text-[#005000]" />
                                </div>
                                <h4 className="font-bold text-[#253D4E] mb-2">Exclusive Offers</h4>
                                <p className="text-gray-600 text-sm text-center">
                                    Access to member-only deals and early bird sales
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-[#005000]/10 rounded-full flex items-center justify-center mb-4">
                                    <Zap className="w-8 h-8 text-[#005000]" />
                                </div>
                                <h4 className="font-bold text-[#253D4E] mb-2">Faster Delivery</h4>
                                <p className="text-gray-600 text-sm text-center">
                                    Priority processing and express delivery options
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-[#005000]/10 rounded-full flex items-center justify-center mb-4">
                                    <Crown className="w-8 h-8 text-[#005000]" />
                                </div>
                                <h4 className="font-bold text-[#253D4E] mb-2">Premium Support</h4>
                                <p className="text-gray-600 text-sm text-center">
                                    Dedicated customer service and priority assistance
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
