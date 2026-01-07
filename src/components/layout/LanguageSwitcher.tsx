"use client";

import { routing, usePathname, useRouter, localeNames } from '@/navigation';
import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("Navbar");

    const onSelectChange = (nextLocale: string) => {
        router.replace(pathname, { locale: nextLocale });
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group"
                aria-label="Change language"
            >
                <Globe className="h-5 w-5 group-hover:text-indigo-600 transition-colors" />
                <span className="text-xs font-bold uppercase hidden sm:inline-block">
                    {locale}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border dark:border-gray-800 overflow-hidden z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                        <p className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b dark:border-gray-800 mb-1">
                            {t("selectLanguage")}
                        </p>
                        {routing.locales.map((cur) => (
                            <button
                                key={cur}
                                onClick={() => onSelectChange(cur)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-bold rounded-lg transition-colors ${locale === cur
                                    ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <span>{localeNames[cur]}</span>
                                {locale === cur && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
