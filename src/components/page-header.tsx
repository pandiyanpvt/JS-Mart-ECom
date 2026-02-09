"use client";

import Image from "next/image";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
    gradient?: string;
}

export default function PageHeader({
    title,
    subtitle,
    description,
    backgroundImage = "/slider-1.png",
    gradient = "from-emerald-500 via-teal-500 to-cyan-500"
}: PageHeaderProps) {
    return (
        <section className="w-full pt-[100px]">
            <div className="w-full">
                <div className="relative overflow-hidden min-h-[300px] md:min-h-[400px]">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={backgroundImage}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-center items-center text-center p-8 z-10">
                        <div className="space-y-3 animate-fade-in">
                            {subtitle && (
                                <h3 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg">
                                    {subtitle}
                                </h3>
                            )}
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-xl">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-white/90 text-base md:text-lg font-medium max-w-2xl mx-auto drop-shadow-md">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
