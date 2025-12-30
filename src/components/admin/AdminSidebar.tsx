"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    FolderTree,
    ClipboardList,
    Zap,
    Menu,
    X,
    ChevronRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Orders", href: "/admin/orders", icon: ClipboardList },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Dropshipping", href: "/admin/dropshipping", icon: Zap },
];

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin</h1>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </header>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-2xl lg:shadow-none border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ease-out transform lg:translate-x-0 lg:static lg:inset-0 lg:z-auto",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="p-8 hidden lg:block">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                                <LayoutDashboard className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Admin<span className="text-indigo-600">.</span></h2>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 lg:px-6 py-4 space-y-2 overflow-y-auto mt-4 lg:mt-0">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                        isActive
                                            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                                            : "text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                                    )}
                                >
                                    <div className="flex items-center relative z-10">
                                        <item.icon className={cn(
                                            "h-5 w-5 mr-3 transition-transform duration-300 group-hover:scale-110",
                                            isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
                                        )} />
                                        <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                    </div>
                                    {isActive && <ChevronRight className="h-4 w-4 text-white/50" />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-6 text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Environment</p>
                            <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">Production v1.0</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
