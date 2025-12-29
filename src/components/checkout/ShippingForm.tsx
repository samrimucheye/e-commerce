"use client";

import { useState } from "react";
import { MapPin, User, Building } from "lucide-react";

interface ShippingFormProps {
    onSubmit: (details: any) => void;
    initialData?: any;
}

export default function ShippingForm({ onSubmit, initialData }: ShippingFormProps) {
    const [formData, setFormData] = useState({
        fullName: initialData?.name || "",
        address: initialData?.address || "",
        city: initialData?.city || "",
        postalCode: initialData?.postalCode || "",
        country: initialData?.country || "USA",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Shipping Information
            </h2>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2 text-gray-900 dark:text-white"
                    />
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</label>
                    <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2 text-gray-900 dark:text-white"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                    <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2 text-gray-900 dark:text-white"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Postal Code</label>
                    <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2 text-gray-900 dark:text-white"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                    <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2 text-gray-900 dark:text-white"
                    >
                        <option value="USA">United States</option>
                        <option value="CAN">Canada</option>
                        <option value="GBR">United Kingdom</option>
                        <option value="AUS">Australia</option>
                    </select>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg dark:shadow-none"
            >
                Confirm Shipping & Proceed to Payment
            </button>
        </form>
    );
}
