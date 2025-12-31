"use client";

import { useState } from "react";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileOverview from "@/components/profile/ProfileOverview";
import OrderHistory from "@/components/profile/OrderHistory";
import ProfileWishlist from "@/components/profile/ProfileWishlist";
import ProfileForm from "@/components/profile/ProfileForm";
import { User } from "lucide-react";

interface ProfileClientProps {
    user: {
        name: string;
        email: string;
        address?: string;
        city?: string;
        postalCode?: string;
        country?: string;
    };
}

export default function ProfileClient({ user }: ProfileClientProps) {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 sm:mb-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl">
                            <User className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                                Welcome back, {user.name.split(' ')[0]}!
                            </h1>
                            <p className="mt-1 text-base sm:text-lg text-gray-600 dark:text-gray-400">
                                Manage your account and track your orders
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Tab Content */}
                <div className="animate-in fade-in duration-300">
                    {activeTab === 'overview' && <ProfileOverview />}
                    {activeTab === 'orders' && <OrderHistory />}
                    {activeTab === 'wishlist' && <ProfileWishlist />}
                    {activeTab === 'settings' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
                            <ProfileForm user={user} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
