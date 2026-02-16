"use client";

import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import HeroSection, { HeroSlide } from "@/components/hero-section";

const contactHeroSlides: HeroSlide[] = [
    {
        id: 1,
        title: "Get in Touch",
        subtitle: "Contact Us",
        description: "Have a question or need assistance? We're here to help! Reach out to our friendly customer support team.",
        buttonText: "Visit FAQ",
        buttonLink: "/faq",
        image: "/images/headers/contact-header.png"
    }
];

export default function ContactPage() {
    const contactInfo = [
        {
            icon: <Phone className="h-6 w-6" />,
            title: "Phone",
            details: ["+94 11 234 5678", "+94 77 123 4567"],
            color: "text-blue-500"
        },
        {
            icon: <Mail className="h-6 w-6" />,
            title: "Email",
            details: ["support@jsmart.lk", "info@jsmart.lk"],
            color: "text-green-500"
        },
        {
            icon: <MapPin className="h-6 w-6" />,
            title: "Address",
            details: ["123 Main Street", "Colombo 00700, Sri Lanka"],
            color: "text-red-500"
        },
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Working Hours",
            details: ["Mon - Sat: 8:00 AM - 8:00 PM", "Sunday: 9:00 AM - 6:00 PM"],
            color: "text-amber-500"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <HeroSection slides={contactHeroSlides} />

            {/* Contact Info Cards */}
            <section className="container mx-auto px-4 md:px-6 lg:px-8 -mt-10 mb-16 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactInfo.map((info, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className={`h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center ${info.color} mb-4`}>
                                {info.icon}
                            </div>
                            <h3 className="text-lg font-bold text-[#253D4E] mb-2">{info.title}</h3>
                            {info.details.map((detail, idx) => (
                                <p key={idx} className="text-gray-600 text-sm">
                                    {detail}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl py-12">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Side - Form */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10">
                        <h2 className="text-3xl font-bold text-[#253D4E] mb-2">Send us a Message</h2>
                        <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>

                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">First Name</label>
                                    <Input
                                        type="text"
                                        placeholder="John"
                                        className="h-12 border-gray-300 focus:border-[#005000] focus:ring-[#005000]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#253D4E] mb-2">Last Name</label>
                                    <Input
                                        type="text"
                                        placeholder="Doe"
                                        className="h-12 border-gray-300 focus:border-[#005000] focus:ring-[#005000]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="h-12 border-gray-300 focus:border-[#005000] focus:ring-[#005000]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">Phone Number</label>
                                <Input
                                    type="tel"
                                    placeholder="+94 77 123 4567"
                                    className="h-12 border-gray-300 focus:border-[#005000] focus:ring-[#005000]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">Subject</label>
                                <Input
                                    type="text"
                                    placeholder="How can we help you?"
                                    className="h-12 border-gray-300 focus:border-[#005000] focus:ring-[#005000]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#253D4E] mb-2">Message</label>
                                <Textarea
                                    placeholder="Tell us more about your inquiry..."
                                    rows={5}
                                    className="border-gray-300 focus:border-[#005000] focus:ring-[#005000] resize-none"
                                />
                            </div>

                            <Button className="w-full h-12 bg-[#005000] hover:bg-[#006600] text-white font-bold text-lg rounded-full flex items-center justify-center gap-2">
                                <Send className="h-5 w-5" />
                                Send Message
                            </Button>
                        </form>
                    </div>

                    {/* Right Side - Map & Additional Info */}
                    <div className="space-y-8">
                        {/* Map Placeholder */}
                        <div className="bg-gray-100 rounded-2xl overflow-hidden h-[400px] border border-gray-200">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58730722305!2d79.77380029999999!3d6.9270786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2s!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        {/* FAQ Link */}
                        <div className="bg-[#253D4E] rounded-2xl p-8 text-white">
                            <h3 className="text-2xl font-bold mb-4">Need Quick Answers?</h3>
                            <p className="text-gray-300 mb-6">
                                Check out our FAQ section for instant answers to common questions about orders, delivery, and more.
                            </p>
                            <Link href="/faq">
                                <Button className="bg-[#005000] hover:bg-[#006600] text-white font-bold h-12 px-8 rounded-full">
                                    Visit FAQ
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Hours Banner */}
            <section className="bg-gray-50 py-16 mt-12">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center max-w-4xl">
                    <h3 className="text-2xl font-bold text-[#253D4E] mb-4">Customer Support Hours</h3>
                    <p className="text-gray-600 text-lg mb-8">
                        Our dedicated support team is available to assist you during the following hours:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <p className="font-bold text-[#253D4E] mb-2">Weekdays</p>
                            <p className="text-gray-600">Monday - Saturday</p>
                            <p className="text-[#005000] font-bold text-xl mt-2">8:00 AM - 8:00 PM</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <p className="font-bold text-[#253D4E] mb-2">Weekend</p>
                            <p className="text-gray-600">Sunday</p>
                            <p className="text-[#005000] font-bold text-xl mt-2">9:00 AM - 6:00 PM</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
