import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
    return (
        <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-10">
                <Link
                    href="/admin/products"
                    className="group flex items-center text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Inventory
                </Link>
            </div>

            <div className="mb-12 text-center">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Create New Product</h1>
                <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
                    Add a premium product to your catalog with advanced status flags.
                </p>
            </div>

            <ProductForm />
        </div>
    );
}
