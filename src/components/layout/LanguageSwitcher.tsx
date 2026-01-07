"use client";

import { routing, usePathname, useRouter, localeNames } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { US, ES, FR, DE, SA, IL, ET } from 'country-flag-icons/react/3x2';

// Map locales to flag components
const flagMap: Record<string, any> = {
    en: US,
    es: ES,
    fr: FR,
    de: DE,
    ar: SA,
    he: IL,
    am: ET
};

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

    const CurrentFlag = flagMap[locale] || US;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group"
                aria-label="Change language"
            >
                <div className="w-5 h-5 flex items-center justify-center overflow-hidden rounded-sm ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm transition-all group-hover:scale-110">
                    <CurrentFlag className="w-full h-full object-cover scale-150" />
                </div>
                <span className="text-xs font-black uppercase hidden sm:inline-block tracking-tighter">
                    {locale}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border dark:border-gray-800 overflow-hidden z-[70] animate-in fade-in slide-in-from-top-3 duration-300 ease-out backdrop-blur-md">
                    <div className="p-2">
                        <p className="px-3 py-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b dark:border-gray-800/50 mb-1">
                            {t("selectLanguage")}
                        </p>
                        <div className="space-y-1">
                            {routing.locales.map((cur) => {
                                const Flag = flagMap[cur] || US;
                                return (
                                    <button
                                        key={cur}
                                        onClick={() => onSelectChange(cur)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${locale === cur
                                            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:translate-x-1'
                                            }`}
                                    >
                                        <div className="w-6 h-4 flex items-center justify-center overflow-hidden rounded-sm ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm shrink-0">
                                            <Flag className="w-full h-full object-cover scale-150" />
                                        </div>
                                        <span className="flex-1 text-left">{localeNames[cur]}</span>
                                        {locale === cur && (
                                            <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-sm animate-pulse" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
