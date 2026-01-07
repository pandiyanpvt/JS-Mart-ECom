"use client";

import { RefreshCcw, ShieldCheck, Clock, Package, HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReturnPolicy() {
    const rules = [
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Return Window",
            content: "For fresh and perishable items, returns must be initiated at the time of delivery or within 4 hours. For non-perishable items, you have up to 7 days to request a return."
        },
        {
            icon: <ShieldCheck className="h-6 w-6" />,
            title: "Condition of Items",
            content: "Items must be unused, in their original packaging, and with all tags intact. Perishable goods will only be accepted if there is a quality issue present at the time of delivery."
        },
        {
            icon: <RefreshCcw className="h-6 w-6" />,
            title: "Refund Process",
            content: "Once we receive and inspect your return, we will notify you of the approval or rejection. Approved refunds are processed to your original payment method within 3-5 business days."
        },
        {
            icon: <Package className="h-6 w-6" />,
            title: "Exchanges",
            content: "We only replace items if they are defective or damaged. If you need to exchange an item for the same product, contact our support team immediately."
        }
    ];

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <section className="bg-lime-500 py-24">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-white font-bold mb-6 hover:translate-x-[-4px] transition-transform">
                        <ArrowLeft className="h-5 w-5" /> Back to Shopping
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
                        Return <span className="text-black">Policy</span>
                    </h1>
                    <p className="text-xl text-lime-50 text-center max-w-2xl mx-auto leading-relaxed">
                        Not satisfied with your purchase? Don't worry, our easy return policy
                        ensures a hassle-free experience for every customer.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-4 max-w-4xl -mt-12">
                <div className="grid md:grid-cols-2 gap-6">
                    {rules.map((rule, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:border-lime-500 transition-all group">
                            <div className="h-14 w-14 bg-lime-100 rounded-2xl flex items-center justify-center text-lime-600 mb-6 group-hover:bg-lime-500 group-hover:text-white transition-all duration-300">
                                {rule.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{rule.title}</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {rule.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Detailed Sections */}
                <div className="mt-20 space-y-12">
                    <div className="border-l-4 border-lime-500 pl-8 overflow-hidden">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Returnable Items</h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 text-lg">
                            <li>Gift cards</li>
                            <li>Downloadable software products</li>
                            <li>Personal care items (opened)</li>
                            <li>Specially discounted clearance items</li>
                        </ul>
                    </div>

                    <div className="p-10 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need further assistance?</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                If you have a specific case that isn't covered here, our
                                support team is ready to help you manually process your request.
                            </p>
                        </div>
                        <Button className="h-14 px-10 bg-black hover:bg-zinc-800 text-white font-bold rounded-2xl whitespace-nowrap" asChild>
                            <Link href="/contact" className="no-underline text-white">Contact Support <HelpCircle className="ml-2 h-5 w-5" /></Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
