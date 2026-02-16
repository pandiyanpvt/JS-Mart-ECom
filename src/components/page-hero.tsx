"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PageHeroProps = {
  image: string;
  imageAlt: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  children?: React.ReactNode;
};

export default function PageHero({
  image,
  imageAlt,
  title,
  subtitle,
  align = "left",
  children,
}: PageHeroProps) {
  return (
    <section className="w-full pt-[92px]">
      <div className="w-full">
        <div className="relative overflow-hidden min-h-[400px] md:min-h-[500px] group">
          {/* Background Image - same as home hero */}
          <div className="absolute inset-0 z-0">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Dark overlay for text readability - same as home hero */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Navigation Arrows - same style as home hero */}
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20 pointer-events-none"
            aria-hidden
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20 pointer-events-none"
            aria-hidden
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Pagination Dot - same style as home hero (single dot) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            <span className="bg-white w-8 h-2 rounded-full" aria-hidden />
          </div>

          {/* Content */}
          <div
            className={`relative z-10 flex min-h-[400px] md:min-h-[500px] items-center px-4 md:px-6 lg:px-8 ${
              align === "center" ? "justify-center text-center" : "justify-start text-left"
            }`}
          >
            <div
              className={`w-full max-w-[1600px] ${align === "center" ? "max-w-4xl mx-auto" : ""}`}
            >
              <h1 className="text-4xl md:text-7xl font-black text-white leading-tight drop-shadow-lg mb-4">
                {title}
              </h1>
              {subtitle && (
                <p
                  className={`text-lg md:text-xl text-white/90 drop-shadow-md ${
                    align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"
                  }`}
                >
                  {subtitle}
                </p>
              )}
              {children && <div className="mt-6">{children}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
