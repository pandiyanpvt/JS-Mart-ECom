"use client";

import { useState } from "react";
import { ChevronDown, Search, ArrowRight, ShoppingBag, HelpCircle, Truck, CreditCard, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const categories = [
        { icon: <Truck className="h-5 w-5" />, label: "Delivery" },
        { icon: <CreditCard className="h-5 w-5" />, label: "Orders & Payment" },
        { icon: <RefreshCcw className="h-5 w-5" />, label: "Returns" },
        { icon: <ShoppingBag className="h-5 w-5" />, label: "Product Info" },
    ];

    const faqs = [
        {
            question: "How long does delivery take?",
            answer: "We offer several delivery options: Same-day delivery (for orders before 12 PM), Next-day delivery, and Standard delivery (2-3 business days). You can select your preferred slot during checkout.",
            category: "Delivery"
        },
        {
            question: "Is there a minimum order value?",
            answer: "No, there is no minimum order value. however, orders over $50 qualify for free standard delivery.",
            category: "Orders & Payment"
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is Shipped, you will receive a tracking link via email and SMS. You can also track your order directly from the 'My Orders' section in your account.",
            category: "Delivery"
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit/debit cards (Visa, Mastercard, Amex), digital wallets (Apple Pay, Google Pay), and Cash on Delivery in selected areas.",
            category: "Orders & Payment"
        },
        {
            question: "Can I return fresh produce if I'm not satisfied?",
            answer: "Yes! If you are not satisfied with the quality of fresh produce, you can return it at the time of delivery or notify our support team within 4 hours. We will issue a refund or replacement immediately.",
            category: "Returns"
        },
        {
            question: "Do you deliver to my area?",
            answer: "We currenty deliver to major cities including Colombo, Kandy, Galle, and surrounding suburbs. You can check specific availability by entering your zip code on the homepage.",
            category: "Delivery"
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white pb-20 pt-4">
            {/* Breadcrumb Section */}
            <div className="container mx-auto px-4 md:px-8 mb-4">
                <nav className="flex items-center text-sm text-gray-500">
                    <Link href="/" className="hover:text-lime-600 transition-colors">Home</Link>
                    <span className="mx-2 text-gray-400 font-bold">&gt;</span>
                    <Link href="/shop" className="font-medium text-gray-900 hover:text-lime-600 transition-colors">All Categories</Link>
                </nav>
            </div>

            {/* Header Section */}
            <section className="bg-lime-500 py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                        How can we <span className="text-black">help you?</span>
                    </h1>
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search for answers..."
                            className="h-14 pl-12 pr-4 bg-white border-none rounded-full shadow-lg text-lg focus-visible:ring-black"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Quick Links / Categories */}
            <section className="container mx-auto px-4 -mt-10 mb-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-black">
                    {categories.map((cat, i) => (
                        <button key={i} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 group">
                            <div className="h-12 w-12 bg-lime-100 rounded-full flex items-center justify-center text-lime-600 mb-3 group-hover:scale-110 transition-transform">
                                {cat.icon}
                            </div>
                            <span className="font-semibold text-gray-900">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* FAQ List */}
            <section className="container mx-auto px-4 max-w-3xl">
                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div key={index} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-lime-300 transition-colors">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 text-left transition-colors"
                                >
                                    <span className="text-lg font-bold text-gray-900">{faq.question}</span>
                                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
                                </button>
                                {openIndex === index && (
                                    <div className="p-6 bg-gray-50 text-gray-600 leading-relaxed border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                                        <p>{faq.answer}</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-lime-600 px-2 py-1 bg-lime-100 rounded">
                                                {faq.category}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <HelpCircle className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">No matching questions found</h3>
                            <p className="text-gray-500">Try using different keywords or contact our support team.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Contact CTA */}
            <section className="container mx-auto px-4 max-w-4xl mt-20">
                <div className="bg-gray-900 rounded-[2rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500 opacity-10 rounded-full blur-3xl -mr-20 -mt-20" />
                    <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        Cant find the answer you looking for? Please chat to our friendly team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="h-12 px-8 bg-lime-500 hover:bg-lime-600 text-white font-bold" asChild>
                            <Link href="/contact" className="no-underline text-white">Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                        <Button variant="outline" className="h-12 px-8 border-white text-white hover:bg-white hover:text-black font-bold">
                            Live Chat
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
