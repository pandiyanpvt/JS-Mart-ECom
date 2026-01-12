"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CardSliderProps = {
    images: string[];
    visibleCount?: number;
    interval?: number;
};

export default function CardSlider({
                                       images,
                                       visibleCount = 4,
                                       interval = 4000,
                                   }: CardSliderProps) {
    const totalSlides = Math.ceil(images.length / visibleCount);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % totalSlides);
        }, interval);

        return () => clearInterval(timer);
    }, [interval, totalSlides]);

    const prev = () =>
        setCurrent((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));

    const next = () =>
        setCurrent((prev) => (prev + 1) % totalSlides);

    return (
        <div className="relative mt-6 overflow-hidden">
            {/* Left Arrow */}
            <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2"
            >
                <ChevronLeft className="w-5 h-5 text-gray-800 hover:text-gray-500" />
            </button>

            {/* Right Arrow */}
            <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2"
            >
                <ChevronRight className="w-5 h-5 text-gray-800 hover:text-gray-500" />
            </button>

            {/* Slider */}
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                    transform: `translateX(-${current * 100}%)`,
                }}
            >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="flex min-w-full">
                        {images
                            .slice(
                                slideIndex * visibleCount,
                                slideIndex * visibleCount + visibleCount
                            )
                            .map((img, index) => (
                                <div key={index} className="w-1/4 px-2">
                                    <Image
                                        src={img}
                                        alt={`Ad ${index + 1}`}
                                        width={400}
                                        height={200}
                                        className="rounded-xl object-cover w-full"
                                    />
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
