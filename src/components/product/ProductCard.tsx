"use client";

import { Link } from "@/navigation";
import { ShoppingCart, Eye, Heart, Star, Sparkles, Flame } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import { useTranslations } from "next-intl";

interface ProductCardProps {
    product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const t = useTranslations("Common");
    const isWishlisted = isInWishlist(product._id);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="group relative bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500"
        >
            {/* Badge Overlay */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 flex flex-col gap-2" style={{ transform: "translateZ(50px)" }}>
                {product.isNewArrival && (
                    <div className="bg-emerald-500 text-white text-[9px] sm:text-[10px] font-black px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center shadow-lg shadow-emerald-500/20 backdrop-blur-md">
                        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> {t("new")}
                    </div>
                )}
                {product.isOnSale && (
                    <div className="bg-rose-500 text-white text-[9px] sm:text-[10px] font-black px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center shadow-lg shadow-rose-500/20 backdrop-blur-md">
                        <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> {t("sale")}
                    </div>
                )}
            </div>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product._id);
                }}
                className={`absolute top-4 right-4 sm:top-5 sm:right-5 z-20 p-2.5 sm:p-3 backdrop-blur-md rounded-xl sm:rounded-2xl transition-all shadow-sm ${isWishlisted
                    ? 'bg-rose-500 text-white shadow-rose-500/20'
                    : 'bg-white/10 dark:bg-black/10 text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                style={{ transform: "translateZ(50px)" }}
            >
                <motion.div
                    animate={isWishlisted ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </motion.div>
            </button>

            <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden">
                <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 sm:p-8">
                    <div className="flex w-full gap-2 translate-y-4 sm:group-hover:translate-y-0 transition-transform duration-500">
                        <button className="flex-1 bg-white text-slate-950 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center hover:bg-indigo-50 transition-colors">
                            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> {t("addToCart")}
                        </button>
                        <div className="p-2.5 sm:p-3 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl text-white">
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                    </div>
                </div>
                {/* Mobile Tap Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:hidden bg-white/20 backdrop-blur-md py-1 px-3 rounded-full text-[10px] text-white font-bold pointer-events-none">
                    {t("viewDetails")}
                </div>
            </Link>

            <div className="p-6 sm:p-8 space-y-3 sm:space-y-4" style={{ transform: "translateZ(30px)" }}>
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                    ))}
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 ml-1">(124 {t("reviews")})</span>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        {product.isOnSale && product.salePrice ? (
                            <>
                                <span className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">${product.salePrice}</span>
                                <span className="text-xs sm:text-sm text-slate-400 line-through font-bold">${product.price}</span>
                            </>
                        ) : (
                            <span className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">${product.price}</span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
