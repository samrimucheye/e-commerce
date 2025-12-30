import dbConnect from "@/lib/db";
import User from "@/models/User";
import { Mail, Calendar, ShieldCheck, ShieldAlert, Plus, Edit } from "lucide-react";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

async function getUsers() {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(users));
}

export default async function AdminCustomersPage() {
    const users = await getUsers();

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Customer Directory</h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Manage your store's users, their roles, and account statuses.
                    </p>
                </div>
                <Link
                    href="/admin/customers/new"
                    className="mt-4 md:mt-0 flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    New Customer
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-2xl overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-700">
                <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-700">
                    {users.map((user: any) => (
                        <li key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                            <div className="px-6 py-6 sm:px-8">
                                <div className="flex items-center justify-between gap-x-6">
                                    <div className="flex items-center min-w-0">
                                        <div className="flex-shrink-0">
                                            {user.image ? (
                                                <img className="h-12 w-12 rounded-2xl object-cover ring-2 ring-indigo-50 dark:ring-indigo-900/30" src={user.image} alt="" />
                                            ) : (
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-inner">
                                                    {user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-5 min-w-0">
                                            <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</div>
                                            <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                <Mail className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-indigo-400" />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden sm:flex flex-col items-center">
                                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin'
                                                ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            }`}>
                                            <div className="flex items-center">
                                                {user.role === 'admin' ? (
                                                    <ShieldAlert className="mr-1 h-3 w-3" />
                                                ) : (
                                                    <ShieldCheck className="mr-1 h-3 w-3" />
                                                )}
                                                {user.role}
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                                            <Calendar className="flex-shrink-0 mr-1 h-3 w-3" />
                                            Joined {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/customers/${user._id}/edit`}
                                            className="p-2.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-50 dark:bg-gray-900 rounded-xl transition-colors hover:bg-white dark:hover:bg-gray-800 shadow-sm border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900"
                                            title="Edit Customer"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors shadow-sm border border-transparent hover:border-rose-100 dark:hover:border-rose-900">
                                            <DeleteButton endpoint={`/api/admin/users/${user._id}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {users.length === 0 && (
                        <div className="px-8 py-20 text-center bg-gray-50/50 dark:bg-gray-900/20">
                            <div className="mx-auto max-w-xs">
                                <Plus className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                                <p className="text-lg font-bold text-gray-900 dark:text-white">No customers yet</p>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Start growing your community by adding your first customer today.
                                </p>
                            </div>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}
