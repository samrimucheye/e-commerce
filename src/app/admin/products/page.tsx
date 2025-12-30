import Link from "next/link";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { Plus, Edit, Package, Star, Zap, Flame, Search, MoreVertical } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

async function getProducts() {
    await dbConnect();
    // Populate category to show name in list
    const products = await Product.find({}).sort({ createdAt: -1 }).populate('category', 'name');
    return JSON.parse(JSON.stringify(products));
}

export default async function AdminProductsPage() {
    const products = await getProducts();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Product Inventory</h1>
                    <p className="mt-1 text-gray-500 font-medium">Manage your catalog, stock levels, and special promotions.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Product
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-bottom border-gray-100 dark:border-gray-700">
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Pricing</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Inventory</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {products.map((product: any) => (
                                <tr key={product._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0 border border-gray-50 dark:border-gray-600">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-gray-900 dark:text-white line-clamp-1">{product.name}</div>
                                                <div className="text-xs text-gray-500 font-medium mt-0.5">slug: {product.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-600 dark:text-gray-400">
                                        {product.category?.name || "Uncategorized"}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center flex-wrap gap-2">
                                            {product.isFeatured && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/30">
                                                    <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                                                </span>
                                            )}
                                            {product.isNewArrival && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                                                    <Zap className="w-3 h-3 mr-1 fill-current" /> New
                                                </span>
                                            )}
                                            {product.isOnSale && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                                                    <Flame className="w-3 h-3 mr-1 fill-current" /> Sale
                                                </span>
                                            )}
                                            {!product.isFeatured && !product.isNewArrival && !product.isOnSale && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-gray-50 text-gray-400 dark:bg-gray-900/40 dark:text-gray-500 border border-gray-100 dark:border-gray-800">
                                                    Standard
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-black text-gray-900 dark:text-white">${product.price.toFixed(2)}</div>
                                        {product.isOnSale && product.salePrice && (
                                            <div className="text-xs text-rose-500 font-bold mt-0.5 line-through decoration-rose-500/30">
                                                ${product.salePrice.toFixed(2)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`text-sm font-bold ${product.stock <= 5 ? 'text-rose-500' : 'text-gray-900 dark:text-white'}`}>
                                            {product.stock} in stock
                                        </div>
                                        <div className="w-16 h-1 bg-gray-100 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${product.stock <= 5 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                                                style={{ width: `${Math.min(product.stock * 5, 100)}%` }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end space-x-1">
                                            <Link
                                                href={`/admin/products/${product.slug}/edit`}
                                                className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                                                title="Edit Product"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </Link>
                                            <DeleteButton endpoint={`/api/products/${product.slug}`} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {products.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-50 dark:bg-gray-900 mb-6">
                            <Search className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">No products found</h3>
                        <p className="mt-2 text-gray-500 max-w-xs mx-auto">Your inventory is currently empty. Start by adding your first product.</p>
                        <Link
                            href="/admin/products/new"
                            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700 transition-all"
                        >
                            <Plus className="h-5 w-5 mr-2" /> Add Product
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
