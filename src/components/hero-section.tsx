"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: "Fresh Groceries",
            subtitle: "Delivered to Your Door",
            description: "Get the freshest produce and groceries delivered same day",
            buttonText: "Shop Now",
            buttonLink: "/shop?category=fresh",
            gradient: "from-emerald-500 via-teal-500 to-cyan-500",
            image: "/slider-1.png"
        },
        {
            id: 2,
            title: "Organic Vegetables",
            subtitle: "100% Natural & Fresh",
            description: "Farm-fresh organic vegetables at your doorstep",
            buttonText: "Explore",
            buttonLink: "/shop?category=vegetables",
            gradient: "from-[#006600] via-[#005000] to-[#003d00]",
            image: "/slider-2.png"
        },
        {
            id: 3,
            title: "Premium Quality",
            subtitle: "Best Prices Guaranteed",
            description: "Shop premium products at unbeatable prices",
            buttonText: "Discover",
            buttonLink: "/shop?category=premium",
            gradient: "from-orange-500 via-amber-500 to-yellow-500",
            image: "/slider-3.png"
        }
    ];

    // Auto-play functionality
    useEffect(() => {
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

    return (
        <section className="w-full pt-[100px]">
            <div className="w-full">
                <div className="relative overflow-hidden min-h-[400px] md:min-h-[500px] group">
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

                            {/* Content */}
                            <div className="relative h-full flex flex-col justify-center items-center text-center p-8 z-10">
                                <div className="space-y-4 animate-fade-in">
                                    <h3 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
                                        {slide.subtitle}
                                    </h3>
                                    <h2 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-xl">
                                        {slide.title}
                                    </h2>
                                    <p className="text-white/90 text-lg md:text-xl font-medium max-w-md mx-auto drop-shadow-md">
                                        {slide.description}
                                    </p>
                                </div>

                                <Link href={slide.buttonLink} className="mt-8">
                                    <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold text-lg px-10 py-6 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                                        {slide.buttonText}
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Arrows */}
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
                </div>
            </div>
        </section>
    );
}
