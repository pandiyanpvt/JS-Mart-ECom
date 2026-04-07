"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveImageSrc } from "@/lib/images";

interface Promotion {
  id: number;
  level: number;
  order: number;
  promotionImg: string;
  isActive: boolean;
  redirectLink?: string;
}

const ROTATE_INTERVAL_MS = 2000;

export default function Level2BannerSection() {
  const [banners, setBanners] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { default: promotionService } = await import("@/services/promotion.service");
        const promotions = await promotionService.getByLevel(2);
        setBanners(promotions.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error("Failed to load level 2 banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading || banners.length === 0) return null;

  return (
    <section className="w-full bg-white py-3 md:py-4">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="relative group w-full aspect-[32/5] overflow-hidden rounded-xl md:rounded-2xl bg-slate-200">
          {banners.map((banner, index) => (
            <Link
              key={banner.id}
              href={banner.redirectLink || "/shop"}
              target={banner.redirectLink?.startsWith("http") ? "_blank" : undefined}
              className={`absolute inset-0 block transition-opacity duration-500 ${
                index === currentIndex
                  ? "opacity-100 z-10 animate__animated animate__slideInLeft"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={resolveImageSrc(banner.promotionImg)}
                alt="Category hero banner"
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority={index === 0}
              />
            </Link>
          ))}
          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-1.5 top-1/2 z-20 flex min-h-[38px] min-w-[38px] -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50 md:left-2 md:opacity-0 md:group-hover:opacity-100"
                aria-label="Previous banner"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-1.5 top-1/2 z-20 flex min-h-[38px] min-w-[38px] -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50 md:right-2 md:opacity-0 md:group-hover:opacity-100"
                aria-label="Next banner"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

