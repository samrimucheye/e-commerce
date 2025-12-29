import Link from "next/link";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { Plus, Edit } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

async function getProducts() {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
}

export default async function AdminProductsPage() {
    const products = await getProducts();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="flex items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {products.map((product: any) => (
                        <li key={product._id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center truncate">
                                        <p className="mr-4 text-sm font-medium text-indigo-600 truncate">{product.name}</p>
                                        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Link
                                            href={`/admin/products/${product.slug}/edit`}
                                            className="p-2 text-gray-400 hover:text-gray-500"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        <DeleteButton endpoint={`/api/products/${product.slug}`} />
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            stock: {product.stock}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {products.length === 0 && (
                        <div className="px-4 py-8 text-center text-gray-500">
                            No products found.
                        </div>
                    )}
                </ul>
            </div>
        </div >
    );
}
