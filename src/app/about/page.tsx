"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShieldCheck, Zap, Heart, ArrowRight } from "lucide-react";
import HeroSection, { HeroSlide } from "@/components/hero-section";

const aboutHeroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Freshness Delivered To Your Doorstep",
    subtitle: "About JS Mart",
    description: "We're on a mission to provide the freshest groceries and a seamless shopping experience for every household.",
    buttonText: "Start Shopping",
    buttonLink: "/shop",
    image: "/images/headers/about-header.png"
  }
];

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "We prioritise our customers' needs and satisfaction in every decision we make."
    },
    {
      icon: ShieldCheck,
      title: "Quality Guaranteed",
      description: "We source only the freshest and highest quality products for our community."
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Our efficient logistics ensure your groceries arrive fresh and on time."
    },
    {
      icon: Star,
      title: "Community Focused",
      description: "We believe in supporting local suppliers and building strong community ties."
    }
  ];

  const stats = [
    { label: "Products", value: "1,000+" },
    { label: "Happy Customers", value: "50,000+" },
    { label: "Support", value: "24/7" },
    { label: "Locations", value: "15+" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HeroSection slides={aboutHeroSlides} />

      {/* Stats */}
      <section className="py-6 sm:py-8 md:py-12 bg-slate-50 border-b border-slate-100">
        <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#253D4E]">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5 sm:mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-6 sm:py-8 md:py-16 bg-white">
        <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-16">
            <div className="flex-1 space-y-4 sm:space-y-5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Our Story
              </p>
              <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#253D4E] leading-tight">
                From a small local store to your <span className="text-[#005000]">digital kitchen</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                JS Mart started with a simple idea: everyone deserves access to the freshest produce
                without the hassle. We began with a small range and a single delivery van.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Today we partner with local growers and trusted suppliers to bring you a wide range
                of premium products. Our focus on quality and reliable delivery has made us a
                trusted name for online grocery in Australia.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#005000] hover:bg-[#006600] text-white text-xs sm:text-sm font-semibold rounded transition-colors min-h-[44px] touch-manipulation"
              >
                Shop now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex-1 relative w-full max-w-lg order-first lg:order-none">
              <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                <Image
                  src="/images/about/story.png"
                  alt="Our Story"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 md:py-16 bg-slate-50">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-xl md:text-2xl font-extrabold text-[#253D4E]">
              Our core values
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#005000]/20 transition-all"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#005000]/10 text-[#005000] flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-[#253D4E] text-sm sm:text-base mb-1.5 sm:mb-2">{value.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-6 sm:py-8 md:py-12 bg-white border-t border-slate-100">
        <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#253D4E] mb-1.5 sm:mb-2">
            Ready to shop?
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6">
            Explore our range of fresh produce and everyday essentials.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#005000] hover:bg-[#006600] text-white text-xs sm:text-sm font-semibold rounded transition-colors min-h-[44px] touch-manipulation"
          >
            Visit shop
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
