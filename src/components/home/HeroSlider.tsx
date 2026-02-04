"use client";

import { useState, useEffect, useCallback } from "react";
import { Link } from "@/navigation";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const colorStyles = {
    indigo: {
        accent: "bg-indigo-500",
        text: "text-indigo-400",
        button: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30",
        progress: "bg-indigo-500"
    },
    rose: {
        accent: "bg-rose-500",
        text: "text-rose-400",
        button: "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30",
        progress: "bg-rose-500"
    },
    emerald: {
        accent: "bg-emerald-500",
        text: "text-emerald-400",
        button: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30",
        progress: "bg-emerald-500"
    },
    amber: {
        accent: "bg-amber-500",
        text: "text-amber-400",
        button: "bg-amber-600 hover:bg-amber-700 shadow-amber-600/30",
        progress: "bg-amber-500"
    }
};

export default function HeroSlider() {
    const t = useTranslations("HomePage");

    const slides = [
        {
            video: "/sport.mp4",
            title: t("heroTitle1"),
            subtitle: t("heroSubtitle1"),
            description: t("heroDesc1"),
            cta: t("heroCta1"),
            link: "/products?category=sports",
            color: "indigo"
        },
        {
            video: "/electronics.mp4",
            title: t("heroTitle2"),
            subtitle: t("heroSubtitle2"),
            description: t("heroDesc2"),
            cta: t("heroCta2"),
            link: "/products?category=electronics",
            color: "rose"
        },
        {
            video: "/home.mp4",
            title: t("heroTitle3"),
            subtitle: t("heroSubtitle3"),
            description: t("heroDesc3"),
            cta: t("heroCta3"),
            link: "/products?category=home",
            color: "emerald"
        },
        {
            video: "/pets.mp4",
            title: t("heroTitle4"),
            subtitle: t("heroSubtitle4"),
            description: t("heroDesc4"),
            cta: t("heroCta4"),
            link: "/products?category=pets",
            color: "amber"
        }
    ];

    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrent((prev) => (prev + newDirection + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        const timer = setInterval(() => paginate(1), 8000); // Increased duration for video usage
        return () => clearInterval(timer);
    }, [paginate]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const currentStyle = colorStyles[slides[current].color as keyof typeof colorStyles];

    return (
        <div className="relative h-[600px] md:h-[750px] w-full overflow-hidden bg-slate-950">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0"
                >
                    <motion.div
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 8 }} // Slower scale for video elegance
                        className="relative w-full h-full"
                    >
                        <video
                            src={slides[current].video}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
                    </motion.div>

                    {/* Content Section */}
                    <div className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-24">
                        <div className="max-w-3xl space-y-4 md:space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-3"
                            >
                                <span className={`h-[2px] w-8 md:w-12 ${currentStyle.accent}`} />
                                <span className={`${currentStyle.text} font-black text-[10px] md:text-xs uppercase tracking-[0.3em]`}>{slides[current].subtitle}</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] sm:leading-none"
                            >
                                {slides[current].title.split(' ').map((word, i) => (
                                    <span key={i} className="inline-block mr-3 md:mr-4">
                                        {word}
                                    </span>
                                ))}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-lg md:text-xl text-slate-300 max-w-xl font-medium leading-relaxed"
                            >
                                {slides[current].description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                                className="pt-2 md:pt-4 flex items-center gap-4 md:gap-6"
                            >
                                <Link
                                    href={slides[current].link}
                                    className={`group relative inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 text-sm md:text-base font-black text-white transition-all duration-300 ${currentStyle.button} rounded-2xl md:rounded-[2rem] overflow-hidden`}
                                >
                                    <span className="relative z-10 flex items-center">
                                        {slides[current].cta}
                                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-white/20"
                                        initial={{ x: "-100%" }}
                                        whileHover={{ x: "0%" }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </Link>

                                <button className="p-4 md:p-5 border-2 border-slate-700/50 rounded-2xl md:rounded-[2rem] text-white hover:bg-white hover:text-slate-950 transition-all">
                                    <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* 3D-feeling decorative orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        y: [0, -40, 0],
                        rotate: [0, 90, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        y: [0, 60, 0],
                        x: [0, 40, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-20 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px]"
                />
            </div>

            {/* Pagination Controls */}
            <div className="absolute bottom-12 left-4 sm:left-12 lg:left-24 z-20 flex items-center gap-6">
                <div className="flex gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > current ? 1 : -1);
                                setCurrent(index);
                            }}
                            className="relative h-1 bg-slate-800 rounded-full overflow-hidden transition-all duration-500"
                            style={{ width: index === current ? "60px" : "30px" }}
                        >
                            {index === current && (
                                <motion.div
                                    layoutId="activeSlide"
                                    className={`absolute inset-0 ${colorStyles[slides[current].color as keyof typeof colorStyles].progress}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 8, ease: "linear" }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => paginate(-1)}
                        className="p-3 rounded-full border border-slate-700 text-white hover:bg-white hover:text-slate-950 transition-all active:scale-95"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => paginate(1)}
                        className="p-3 rounded-full border border-slate-700 text-white hover:bg-white hover:text-slate-950 transition-all active:scale-95"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
