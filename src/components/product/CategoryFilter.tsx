"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface CategoryFilterProps {
    categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleCategoryChange = (categoryId: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (categoryId) {
            params.set("category", categoryId);
        } else {
            params.delete("category");
        }
        // Reset page to 1 when filter changes
        params.delete("page");

        router.push(`/products?${params.toString()}`);
        setIsOpen(false);
    };

    const selectedCategoryName = currentCategory
        ? categories.find(c => c._id === currentCategory)?.name
        : "All Categories";

    // Close on click outside
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
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex justify-between w-full rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {selectedCategoryName}
                    <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition-all animate-in fade-in zoom-in-95 duration-200">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        <button
                            onClick={() => handleCategoryChange(null)}
                            className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            role="menuitem"
                        >
                            <span>All Categories</span>
                            {!currentCategory && <Check className="h-4 w-4 text-indigo-600" />}
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => handleCategoryChange(category._id)}
                                className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                role="menuitem"
                            >
                                <span>{category.name}</span>
                                {currentCategory === category._id && <Check className="h-4 w-4 text-indigo-600" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
