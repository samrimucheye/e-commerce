import Link from "next/link";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { Plus, Edit } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

async function getCategories() {
    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
}

export default async function AdminCategoriesPage() {
    const categories = await getCategories();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <Link
                    href="/admin/categories/new"
                    className="flex items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {categories.map((category: any) => (
                        <li key={category._id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center truncate">
                                        <p className="text-sm font-medium text-indigo-600 truncate">{category.name}</p>
                                        <p className="ml-4 text-sm text-gray-500">/{category.slug}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Link
                                            href={`/admin/categories/${category._id}/edit`}
                                            className="p-2 text-gray-400 hover:text-gray-500"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        <DeleteButton endpoint={`/api/categories/${category._id}`} />
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {categories.length === 0 && (
                        <div className="px-4 py-8 text-center text-gray-500">
                            No categories found.
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}
