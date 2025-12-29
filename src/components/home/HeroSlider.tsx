"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    {
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&h=800&auto=format&fit=crop",
        title: "Modern Collections",
        description: "Discover our latest arrivals of premium quality products designed for your lifestyle.",
        cta: "Shop New Arrivals",
        link: "/products"
    },
    {
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&h=800&auto=format&fit=crop",
        title: "Tech Innovation",
        description: "Stay ahead with the latest gadgets and electronics at unbeatable prices.",
        cta: "Explore Tech",
        link: "/products"
    },
    {
        image: "https://images.unsplash.com/photo-1449247701024-2c11438f2f63?q=80&w=1600&h=800&auto=format&fit=crop",
        title: "Home Essentials",
        description: "Transform your living space with our curated home and lifestyle essentials.",
        cta: "Browse Home",
        link: "/products"
    }
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    return (
        <div className="relative h-[500px] w-full overflow-hidden group">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority={index === 0}
                        className="object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="max-w-3xl px-6 text-center transform transition-transform duration-700 delay-300 translate-y-0 text-white">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">
                                {slide.title}
                            </h1>
                            <p className="text-lg md:text-xl mb-8 text-gray-100 drop-shadow-md">
                                {slide.description}
                            </p>
                            <Link
                                href={slide.link}
                                className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-xl"
                            >
                                {slide.cta}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-2 rounded-full transition-all ${index === current ? "w-8 bg-indigo-500" : "w-2 bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
