"use client";

import { useState } from "react";
import { LayoutDashboard, Package, Heart, Settings } from "lucide-react";

interface ProfileTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-2 mb-6 sm:mb-8">
            <div className="grid grid-cols-2 sm:flex sm:space-x-2 gap-2 sm:gap-0">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold text-sm transition-all ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
