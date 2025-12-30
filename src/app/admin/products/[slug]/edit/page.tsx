"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                } else {
                    setError("Failed to fetch product details");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Fetching product data...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 font-bold">
                {error}
            </div>
            <Link href="/admin/products" className="text-indigo-600 font-bold hover:underline flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
            </Link>
        </div>
    );

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
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Edit Product</h1>
                <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
                    Modifying <span className="text-indigo-600 font-bold">{product?.name}</span>
                </p>
            </div>

            <ProductForm initialData={product} isEditing={true} />
        </div>
    );
}
