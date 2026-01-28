"use client";

import { ScrollText, Gavel, Scale, AlertCircle, ShoppingCart, Ban, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsConditions() {
    const terms = [
        {
            icon: <ShoppingCart className="h-6 w-6" />,
            title: "Acceptance of Terms",
            content: "By accessing and using JS Mart, you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our services."
        },
        {
            icon: <Gavel className="h-6 w-6" />,
            title: "User Accounts",
            content: "You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old or under adult supervision to create an account."
        },
        {
            icon: <Scale className="h-6 w-6" />,
            title: "Pricing and Availability",
            content: "All prices are subject to change without notice. We strive for accuracy but do not guarantee that all product descriptions or prices are error-free."
        },
        {
            icon: <Ban className="h-6 w-6" />,
            title: "Order Cancellation",
            content: "We reserve the right to cancel orders if products are unavailable or if we suspect fraudulent activity. You may cancel your order at any time before it is processed."
        },
        {
            icon: <AlertCircle className="h-6 w-6" />,
            title: "Limitation of Liability",
            content: "JS Mart is not liable for any indirect, incidental, or consequential damages arising from the use of our platform or any products purchased through it."
        },
        {
            icon: <ScrollText className="h-6 w-6" />,
            title: "Governing Law",
            content: "These terms are governed by the laws of Sri Lanka. Any disputes shall be resolved in the courts of Colombo."
        }
    ];

    return (
        <div className="min-h-screen bg-white pb-20 pt-4">
            {/* Hero Section */}
            <section className="bg-gray-900 text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-lime-500 rounded-full filter blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <Link href="/" className="inline-flex items-center gap-2 text-lime-400 font-bold mb-6 hover:text-lime-300 transition-colors">
                            <ArrowLeft className="h-5 w-5" /> Back to Store
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                            Terms & <span className="text-lime-500">Conditions</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed font-sans">
                            Please read these terms carefully before using our platform.
                            Last modified: Jan 07, 2026.
                        </p>
                    </div>
                </div>
            </section>

            {/* Terms List Section */}
            <section className="container mx-auto px-4 max-w-4xl py-20">
                <div className="grid gap-12">
                    {terms.map((term, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-8 items-start group">
                            <div className="flex-shrink-0 h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-lime-500 group-hover:bg-lime-50 transition-all duration-300 border border-gray-100 group-hover:border-lime-100">
                                {term.icon}
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <span className="text-lime-500 font-mono text-sm opacity-50">0{i + 1}</span>
                                    {term.title}
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-lg font-sans">
                                    {term.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-24 p-12 bg-lime-50 rounded-[2.5rem] border border-lime-100 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Any disagreements?</h3>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
                        If you have any questions or concern regarding our Terms & Conditions,
                        please contact our legal team for clarification.
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 h-14 rounded-full font-bold hover:bg-black transition-all">
                        Contact Legal Team
                    </Link>
                </div>
            </section>
        </div>
    );
}
