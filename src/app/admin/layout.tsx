import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Users, FolderTree, ClipboardList, Zap } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-md border-r dark:border-gray-700">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin</h2>
                </div>
                <nav className="mt-6">
                    <Link
                        href="/admin"
                        className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                        <LayoutDashboard className="h-5 w-5 mr-3" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/products"
                        className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                        <ShoppingBag className="h-5 w-5 mr-3" />
                        Products
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                        <FolderTree className="h-5 w-5 mr-3" />
                        Categories
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                        <ClipboardList className="h-5 w-5 mr-3" />
                        Orders
                    </Link>
                    <Link
                        href="/admin/customers"
                        className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                        <Users className="h-5 w-5 mr-3" />
                        Customers
                    </Link>
                    <Link
                        href="/admin/dropshipping"
                        className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                        <Zap className="h-5 w-5 mr-3" />
                        Dropshipping
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
