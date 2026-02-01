"use client";

import { Shield, Lock, Eye, Bell, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PrivacyPolicy() {
    const sections = [
        {
            icon: <Eye className="h-6 w-6" />,
            title: "Information We Collect",
            content: "We collect information you provide directly to us, such as when you create an account, place an order, or contact us. This may include your name, email address, phone number, and delivery address."
        },
        {
            icon: <Lock className="h-6 w-6" />,
            title: "How We Use Your Data",
            content: "We use the information we collect to process your orders, provide customer support, and improve our services. We may also use your data to send you promotional offers if you have opted in."
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Data Protection",
            content: "We implement industry-standard security measures to protect your personal information from unauthorized access, loss, or misuse. All transactions are encrypted using secure socket layer (SSL) technology."
        },
        {
            icon: <Bell className="h-6 w-6" />,
            title: "Third-Party Sharing",
            content: "We do not sell your personal data. We only share information with trusted third parties necessary for completing your orders, such as payment processors and delivery partners."
        },
        {
            icon: <Trash2 className="h-6 w-6" />,
            title: "Your Rights",
            content: "You have the right to access, update, or delete your personal information at any time. You can manage your preferences through your account settings or by contacting us directly."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-4">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 pb-4">
                <Link href="/" className="inline-flex items-center gap-2 text-[#3BB77E] font-semibold mb-6 hover:text-[#299E63] transition-colors">
                    <ArrowLeft className="h-5 w-5" /> Back to Home
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Privacy Policy
                </h1>
                <p className="text-gray-600 mt-2">
                    Last Updated: January 2026
                </p>
            </div>

            {/* Content Section */}
            <section className="container mx-auto px-4 max-w-4xl py-12">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12 space-y-12">
                        {sections.map((section, i) => (
                            <div key={i} className="flex gap-6 group">
                                <div className="flex-shrink-0 h-14 w-14 bg-lime-50 rounded-2xl flex items-center justify-center text-lime-600 group-hover:bg-lime-500 group-hover:text-white transition-all duration-300">
                                    {section.icon}
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        ))}

                        <div className="pt-8 border-t border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
                            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                                By using our website, you consent to our use of cookies according to this policy.
                            </p>
                            <Button className="bg-black hover:bg-zinc-800 text-white font-bold h-12 px-8">
                                Manage Cookie Settings
                            </Button>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl flex items-start gap-4">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Shield className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-blue-900">Questions about your privacy?</h3>
                                <p className="text-blue-700 mt-1">
                                    Email us at <a href="mailto:privacy@jsmart.com" className="font-bold underline">privacy@jsmart.com</a> for any concerns regarding your data.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
