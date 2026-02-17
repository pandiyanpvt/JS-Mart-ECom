"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image: string;
}

interface HeroSectionProps {
    slides?: HeroSlide[];
    level?: number;
    className?: string;
    allowDefaults?: boolean;
}

export default function HeroSection({
    slides: customSlides,
    level = 1,
    className,
    allowDefaults = true
}: HeroSectionProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const defaultSlides: HeroSlide[] = [
        {
            id: 1,
            title: "Fresh Groceries",
            subtitle: "Delivered to Your Door",
            description: "Get the freshest produce and groceries delivered same day",
            buttonText: "Shop Now",
            buttonLink: "/shop?category=fresh",
            image: "/slider-1.png"
        },
        {
            id: 2,
            title: "Organic Vegetables",
            subtitle: "100% Natural & Fresh",
            description: "Farm-fresh organic vegetables at your doorstep",
            buttonText: "Explore",
            buttonLink: "/shop?category=vegetables",
            image: "/slider-2.png"
        },
        {
            id: 3,
            title: "Premium Quality",
            subtitle: "Best Prices Guaranteed",
            description: "Shop premium products at unbeatable prices",
            buttonText: "Discover",
            buttonLink: "/shop?category=premium",
            image: "/slider-3.png"
        }
    ];

    const [slides, setSlides] = useState<HeroSlide[]>(
        customSlides || (allowDefaults ? defaultSlides : [])
    );

    // Fetch promotions on mount
    useEffect(() => {
        if (customSlides) return; // Use custom slides if provided

        const fetchBanners = async () => {
            try {
                // Dynamic import to avoid circular dependencies
                const { default: promotionService } = await import("@/services/promotion.service");
                const promotions = await promotionService.getByLevel(level);

                if (promotions && promotions.length > 0) {
                    const mappedSlides: HeroSlide[] = promotions
                        .sort((a: any, b: any) => a.order - b.order)
                        .map((p: any) => ({
                            id: p.id,
                            title: "", // Backend banners are currently images only
                            subtitle: "",
                            description: "",
                            buttonText: "",
                            buttonLink: "/shop",
                            image: p.promotionImg
                        }));
                    setSlides(mappedSlides);
                }
            } catch (error) {
                console.error("Failed to load hero banners:", error);
            }
        };

        fetchBanners();
    }, [customSlides, level]);

    // Auto-play functionality
    useEffect(() => {
        if (slides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    if (slides.length === 0) return null;

    return (
        <section className="w-full">
            <div className="w-full">
                <div className={`relative overflow-hidden group ${className || "min-h-[400px] md:min-h-[500px]"}`}>
                    {/* Slides */}
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 w-full h-full ${index === currentSlide
                                ? "opacity-100 z-10"
                                : "opacity-0 z-0 pointer-events-none"
                                }`}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            </div>

                            {/* Dark overlay for text readability */}
                            <div className="absolute inset-0 bg-black/30"></div>

                        </div>
                    ))}

                    {/* Navigation Arrows */}
                    {slides.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Pagination Dots */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`transition-all rounded-full ${index === currentSlide
                                            ? "bg-white w-8 h-2"
                                            : "bg-white/50 hover:bg-white/75 w-2 h-2"
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
