import Link from "next/link";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { Plus, Edit, FolderTree } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

async function getCategories() {
    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
}

export default async function AdminCategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Categories</h1>
                    <p className="mt-1 text-gray-500 font-medium">Organize your products into logical collections.</p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all active:scale-[0.95]"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Category
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
                <ul role="list" className="divide-y divide-gray-50 dark:divide-gray-700">
                    {categories.map((category: any) => (
                        <li key={category._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                            <div className="px-6 py-6 sm:px-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center min-w-0">
                                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                                            <FolderTree className="h-6 w-6" />
                                        </div>
                                        <div className="ml-5 min-w-0">
                                            <p className="text-base font-black text-gray-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">{category.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight truncate">slug: {category.slug}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/categories/${category._id}/edit`}
                                            className="p-3 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-50 dark:bg-gray-800/50 rounded-2xl transition-all hover:scale-110"
                                            title="Edit Category"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all hover:scale-110">
                                            <DeleteButton endpoint={`/api/categories/${category._id}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {categories.length === 0 && (
                        <div className="p-20 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-50 dark:bg-gray-900 mb-6">
                                <FolderTree className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">No categories found</h3>
                            <p className="mt-2 text-gray-500 max-w-xs mx-auto">Create your first category to start organizing your inventory.</p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}
