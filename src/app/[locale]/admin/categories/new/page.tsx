"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCategoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            slug: formData.get("slug"),
            description: formData.get("description"),
            image: formData.get("image"),
        };

        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push("/admin/categories");
                router.refresh();
            } else {
                const err = await res.json();
                setError(err.message || "Failed to create category");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add New Category</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input
                        name="name"
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <input
                        name="slug"
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                        name="image"
                        type="url"
                        placeholder="https://..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Category'}
                    </button>
                </div>
            </form>
        </div>
    );
}
