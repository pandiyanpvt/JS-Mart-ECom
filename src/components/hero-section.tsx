"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const slides = [
    {
        id: 1,
        image: "/slider-1.png",
        title: "Fresh Fruits",
        subtitle: "Big discount",
        color: "#3BB77E",
    },
    {
        id: 2,
        image: "/slider-2.png",
        title: "Organic Vegetables",
        subtitle: "Healthy Life",
        color: "#3BB77E",
    },
    {
        id: 3,
        image: "/slider-3.png",
        title: "Fresh Breakfast",
        subtitle: "Start your day",
        color: "#FDc040", // Yellowish for breakfast
    },
    {
        id: 4,
        image: "/slider-4.png",
        title: "Pantry Essentials",
        subtitle: "Best Quality",
        color: "#6B7280", // Grayish for pantry
    },
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const setSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8">
            <div className="relative overflow-hidden bg-[#f4f6f8] min-h-[400px] md:min-h-[500px] flex items-center justify-center shadow-sm rounded-[2rem]">

                {/* Background Images - Slider */}
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover object-center"
                            priority={index === 0}
                        />
                    </div>
                ))}

                {/* Content Overlay */}
                <div className="relative z-10 container flex flex-col items-center text-center px-4">

                    {/* Dynamic Text */}
                    <div className="space-y-4 mb-8 transition-all duration-500">
                        <h1 className="text-5xl md:text-7xl font-black text-[#253D4E] leading-tight drop-shadow-sm">
                            {slides[currentSlide].title}
                        </h1>
                        <h1
                            className="text-5xl md:text-7xl font-black leading-tight"
                            style={{ color: slides[currentSlide].color }}
                        >
                            {slides[currentSlide].subtitle}
                        </h1>
                    </div>

                    {/* Shop Now Button */}
                    <Link href="/shop" passHref>
                        <Button
                            className="text-white font-bold text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                            style={{ backgroundColor: "#3BB77E" }} // Consistent green button
                        >
                            Shop Now
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>

                {/* Pagination Dots */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setSlide(index)}
                            className={`h-2.5 w-2.5 rounded-full cursor-pointer transition-all ${currentSlide === index
                                ? "bg-[#3BB77E] w-8"
                                : "bg-gray-400 hover:bg-[#3BB77E]"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
