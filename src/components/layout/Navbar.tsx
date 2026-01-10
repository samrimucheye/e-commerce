"use client";

import { Link, useRouter } from "@/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ShoppingCart, Menu, X, User, Search, Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
    const { totalItems } = useCart();
    const { wishlist } = useWishlist();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("Navbar");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchVisible(false);
            setSearchResults([]);
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        const fetchResults = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
                const data = await res.json();
                setSearchResults(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Live search error:", err);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setSearchResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isSearchVisible && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchVisible]);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b dark:border-gray-800 transition-all duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex items-center gap-8">
                        <div className="flex flex-shrink-0 items-center">
                            <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tighter hover:scale-105 transition-transform">
                                SENAY<span className="text-gray-900 dark:text-white">.</span>
                            </Link>
                        </div>
                        <div className="hidden lg:flex lg:space-x-6">
                            <Link
                                href="/products"
                                className="text-sm font-semibold text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                            >
                                {t("products")}
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm font-semibold text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                            >
                                {t("about")}
                            </Link>
                            <Link
                                href="/contact"
                                className="text-sm font-semibold text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                            >
                                {t("contact")}
                            </Link>
                        </div>
                    </div>

                    {/* Integrated Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={searchContainerRef}>
                        <form onSubmit={handleSearch} className="relative w-full group">
                            <input
                                type="text"
                                placeholder={t("searchPlaceholder")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        </form>

                        {/* Live Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border dark:border-gray-800 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="p-2">
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product._id}
                                            href={`/products/${product.slug}`}
                                            onClick={() => setSearchResults([])}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                                        >
                                            <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                                                <img
                                                    src={product.images?.[0] || 'https://placehold.co/40x40'}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {product.category?.name || 'In Products'}
                                                </p>
                                            </div>
                                            <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                                                ${product.price.toFixed(2)}
                                            </p>
                                        </Link>
                                    ))}
                                    <button
                                        onClick={handleSearch}
                                        className="w-full mt-2 p-2 text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                    >
                                        View all results
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 font-medium">
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsSearchVisible(!isSearchVisible)}
                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        </div>

                        <Link href="/wishlist" className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group">
                            <Heart className="h-5 w-5 group-hover:text-rose-500 transition-colors" />
                            {wishlist.length > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>

                        <Link href="/cart" className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group">
                            <ShoppingCart className="h-5 w-5 group-hover:text-indigo-600 transition-colors" />
                            {totalItems > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-gray-700" />

                        <div className="hidden sm:block">
                            <ThemeToggle />
                        </div>

                        <LanguageSwitcher />

                        {session ? (
                            <div className="hidden lg:flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Welcome,</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[120px]">
                                        {session.user?.name}
                                    </span>
                                </div>
                                {(session.user as any).role === 'admin' && (
                                    <Link href="/admin" className="text-xs font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded">
                                        {t("admin")}
                                    </Link>
                                )}
                                <Link
                                    href="/profile"
                                    className="p-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 rounded-full transition-colors"
                                    title={t("profile")}
                                >
                                    <User className="h-5 w-5" />
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                    title={t("signOut")}
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="text-sm font-bold text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                                >
                                    {t("signIn")}
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-4 py-2 rounded-full transition-all hover:shadow-lg active:scale-95"
                                >
                                    {t("join")}
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <div className="lg:hidden">
                            <button
                                type="button"
                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? (
                                    <X className="h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {isSearchVisible && (
                <div className="md:hidden p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800 animate-in slide-in-from-top duration-300">
                    <form onSubmit={handleSearch} className="relative group">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="What are you looking for?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <button
                            type="button"
                            onClick={() => setIsSearchVisible(false)}
                            className="absolute right-4 top-3.5 text-xs font-bold text-gray-500 dark:text-gray-400"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {/* Mobile menu, show/hide based on menu state. */}
            {isMenuOpen && (
                <div className="lg:hidden border-t dark:border-gray-800 bg-white dark:bg-gray-900 animate-in slide-in-from-top duration-300">
                    <div className="space-y-1 pb-3 pt-2">
                        <Link
                            href="/products"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-4 text-base font-bold text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600 border-l-4 border-transparent hover:border-indigo-600 transition-all"
                        >
                            {t("exploreProducts")}
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-4 text-base font-bold text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600 border-l-4 border-transparent hover:border-indigo-600 transition-all"
                        >
                            {t("ourStory")}
                        </Link>
                        <Link
                            href="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-4 text-base font-bold text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600 border-l-4 border-transparent hover:border-indigo-600 transition-all"
                        >
                            {t("contactSupport")}
                        </Link>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 p-4">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t("settings")}</span>
                            <ThemeToggle />
                        </div>

                        {session ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black">
                                        {session.user?.name?.[0].toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{session.user?.name}</span>
                                        <span className="text-xs text-gray-500">{(session.user as any).role || 'Customer'}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full py-3 px-4 text-center text-sm font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl"
                                    >
                                        My Profile
                                    </Link>
                                    {(session.user as any).role === 'admin' && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block w-full py-3 px-4 text-center text-sm font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="block w-full py-3 px-4 text-center text-sm font-bold text-red-600 border border-red-100 dark:border-red-900/30 rounded-xl"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center py-3 text-sm font-bold border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400"
                                >
                                    {t("signIn")}
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center py-3 text-sm font-bold bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none"
                                >
                                    {t("joinNow")}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
