"use client";

import { useState, useEffect, useCallback } from "react";
import { Link } from "@/navigation";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";


export default function HeroSlider() {
    const t = useTranslations("HomePage");

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&h=800&auto=format&fit=crop",
            title: t("heroTitle1"),
            subtitle: t("heroSubtitle1"),
            description: t("heroDesc1"),
            cta: t("heroCta1"),
            link: "/products",
            color: "indigo"
        },
        {
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&h=800&auto=format&fit=crop",
            title: t("heroTitle2"),
            subtitle: t("heroSubtitle2"),
            description: t("heroDesc2"),
            cta: t("heroCta2"),
            link: "/products",
            color: "rose"
        },
        {
            image: "https://images.unsplash.com/photo-1449247701024-2c11438f2f63?q=80&w=1600&h=800&auto=format&fit=crop",
            title: t("heroTitle3"),
            subtitle: t("heroSubtitle3"),
            description: t("heroDesc3"),
            cta: t("heroCta3"),
            link: "/products",
            color: "emerald"
        }
    ];

    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrent((prev) => (prev + newDirection + slides.length) % slides.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => paginate(1), 6000);
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
                        transition={{ duration: 6 }}
                        className="relative w-full h-full"
                    >
                        <img
                            src={slides[current].image}
                            alt={slides[current].title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
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
                                <span className="h-[2px] w-8 md:w-12 bg-indigo-500" />
                                <span className="text-indigo-400 font-black text-[10px] md:text-xs uppercase tracking-[0.3em]">{slides[current].subtitle}</span>
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
                                    className="group relative inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 text-sm md:text-base font-black text-white transition-all duration-300 bg-indigo-600 rounded-2xl md:rounded-[2rem] hover:bg-indigo-700 shadow-2xl shadow-indigo-600/30 overflow-hidden"
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
                                    className="absolute inset-0 bg-indigo-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 6, ease: "linear" }}
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
