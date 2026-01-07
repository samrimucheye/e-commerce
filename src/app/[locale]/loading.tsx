import React from 'react';

const ProductSkeleton = () => (
    <div className="animate-pulse flex flex-col space-y-4">
        <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        </div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mt-auto" />
    </div>
);

const SectionSkeleton = ({ title, showViewAll = true }: { title: string, showViewAll?: boolean }) => (
    <section className="space-y-10">
        <div className="flex items-center justify-between">
            <div>
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-48 mb-2" />
                <div className="h-1.5 w-20 bg-indigo-200 dark:bg-indigo-900 rounded-full" />
            </div>
            {showViewAll && <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />}
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    </section>
);

export default function Loading() {
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen overflow-hidden">
            {/* Hero Skeleton */}
            <div className="relative h-[600px] bg-slate-100 dark:bg-slate-900 animate-pulse flex items-center justify-center">
                <div className="max-w-3xl w-full px-4 space-y-6 text-center">
                    <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl mx-auto w-3/4" />
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto w-1/2" />
                    <div className="flex justify-center gap-4 mt-8">
                        <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-800" />
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-32">
                {/* Featured Section Skeleton */}
                <SectionSkeleton title="Featured Selection" />

                {/* New Arrivals Section Skeleton */}
                <div className="space-y-12">
                    <div className="relative flex justify-center py-12">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-100 dark:border-slate-800" />
                        </div>
                        <div className="relative bg-white dark:bg-gray-900 px-8">
                            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-48" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                </div>

                {/* Sale Section Skeleton */}
                <div className="bg-slate-50 dark:bg-slate-900/50 -mx-4 px-4 py-20 sm:-mx-6 sm:px-12 lg:-mx-8 lg:px-24 rounded-[3rem] border border-slate-100 dark:border-slate-800 relative">
                    <div className="flex items-center justify-between mb-12">
                        <div className="space-y-2">
                            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-40" />
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-64" />
                        </div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32" />
                    </div>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
