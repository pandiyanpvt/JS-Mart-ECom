"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Top banners
const banners = [
    "/images/ad/image1.png",
    "/images/ad/image11.png",
    "/images/ad/image12.png",
    "/images/ad/image13.png",
];

// Bottom ad images
const bottomAds = [
    "/images/ad/image2.png",
    "/images/ad/image3.png",
    "/images/ad/image4.png",
    "/images/ad/image5.png",
    "/images/ad/image6.png",
    "/images/ad/image7.png",
    "/images/ad/image8.png",
    "/images/ad/image9.png",
];

export default function AdvertisementSection() {
    const [current, setCurrent] = useState(0);
    const [bottomCurrent, setBottomCurrent] = useState(0);
    const bottomRef = useRef(null);

    // Auto slide every 4 seconds for top banner
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
            setBottomCurrent((prev) => (prev + 1) % bottomAds.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % banners.length);
    };

    const prevBottom = () => {
        setBottomCurrent((prev) => (prev === 0 ? bottomAds.length - 1 : prev - 1));
    };

    const nextBottom = () => {
        setBottomCurrent((prev) => (prev + 1) % bottomAds.length);
    };

    return (
        <section className="xl:mx-auto xl:max-w-7xl xl:px-8 px-4 sm:px-6 lg:px-8 mt-6">
            {/* Top Banner Slider */}
            <div className="relative overflow-hidden rounded-xl">
                {/* Top Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 transition-colors duration-300"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-800 hover:text-gray-500" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 transition-colors duration-300"
                >
                    <ChevronRight className="w-6 h-6 text-gray-800 hover:text-gray-500" />
                </button>
                <div
                    className="flex h-full transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {banners.map((banner, index) => (
                        <div key={index} className="relative w-full h-full flex-shrink-0">
                            <Image
                                src={banner}
                                alt={`Banner ${index + 1}`}
                                className="w-full h-auto object-cover"
                                width={1400}
                                height={350}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Card Slider */}
            <div className="relative mt-6 overflow-hidden">
                {/* Arrows */}
                <button
                    onClick={prevBottom}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 transition-colors duration-300"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-800 hover:text-gray-500" />
                </button>
                <button
                    onClick={nextBottom}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 transition-colors duration-300"
                >
                    <ChevronRight className="w-5 h-5 text-gray-800 hover:text-gray-500" />
                </button>

                {/* Slider */}
                <div
                    ref={bottomRef}
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${bottomCurrent * (100 / 4)}%)` }}
                >
                    {bottomAds.map((ad, index) => (
                        <div key={index} className="min-w-[25%] px-2">
                            <Image
                                src={ad}
                                alt={`Ad ${index + 1}`}
                                width={400}
                                height={200}
                                className="rounded-xl object-cover w-full"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
