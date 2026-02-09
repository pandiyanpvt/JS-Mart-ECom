"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Zap, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="h-6 w-6 text-rose-500" />,
      title: "Customer First",
      description: "We prioritize our customers' needs and satisfaction in every decision we make."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
      title: "Quality Guaranteed",
      description: "We source only the freshest and highest quality products for our community."
    },
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: "Fast Delivery",
      description: "Our efficient logistics ensure your groceries arrive fresh and on time."
    },
    {
      icon: <Star className="h-6 w-6 text-[#3BB77E]" />,
      title: "Community Focused",
      description: "We believe in supporting local suppliers and building strong community ties."
    }
  ];


  const stats = [
    { label: "Products", value: "1,000+" },
    { label: "Happy Customers", value: "50,000+" },
    { label: "Support", value: "24/7" },
    { label: "Cities", value: "15+" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full pt-[100px]">
        <div className="w-full">
          <div className="relative overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/headers/about-header.png"
                alt="Fresh Produce Background"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30"></div>

            <div className="relative z-10 text-center text-white px-4 max-w-4xl">
              <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-6 drop-shadow-lg text-white">
                Freshness Delivered <br />
                <span className="text-[#3BB77E] font-black">To Your Doorstep</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-md">
                We&apos;re on a mission to provide the freshest groceries and a seamless shopping
                experience for every household.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop" className="no-underline">
                  <Button className="h-12 px-8 bg-[#3BB77E] hover:bg-[#299E63] text-white font-semibold text-lg transition-all shadow-lg rounded-full">
                    Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact" className="no-underline">
                  <Button className="h-12 px-8 bg-white hover:bg-gray-100 text-[#253D4E] font-semibold text-lg transition-all shadow-lg rounded-full border border-gray-200">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group transition-transform hover:-translate-y-1">
                <div className="text-3xl md:text-4xl font-bold text-[#253D4E] group-hover:text-[#3BB77E] transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-500 font-medium uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-4 py-1.5 bg-[#3BB77E]/10 text-[#3BB77E] rounded-full text-sm font-bold uppercase tracking-wide">
                Our Story
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-[#253D4E] leading-tight">
                From a Small Local Store to Your <span className="text-[#3BB77E]">Digital Kitchen</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded in 2020, JS Mart began with a simple idea: everyone deserves access
                to the freshest produce without the hassle of a traditional grocery store run.
                We started in a small basement with just 50 products and a single delivery van.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we partner with local farmers and global suppliers to bring over 1,000
                premium products directly to you. Our commitment to quality and speed has
                helped us become the most trusted online grocery app in Sri Lanka.
              </p>
              <div className="pt-4">
                <Link href="/shop" className="flex items-center gap-2 text-[#3BB77E] hover:text-[#299E63] font-bold text-lg group no-underline">
                  Check out our products <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl z-10 scale-95 lg:scale-100">
                <Image
                  src="/images/about/story.png"
                  alt="Our Story"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative background elements */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#3BB77E] rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[#253D4E] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3BB77E] rounded-full filter blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-700 rounded-full filter blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Our Core Values</h2>
            <p className="text-lg text-gray-300">
              These principles guide every action we take to provide you with the best experience possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[#3BB77E]/50 transition-all duration-300 group">
                <div className="mb-6 p-4 bg-white/10 rounded-xl inline-block group-hover:bg-[#3BB77E]/20 transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
