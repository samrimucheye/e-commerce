import dbConnect from "@/lib/db";
import User from "@/models/User";
import { Mail, Calendar, ShieldCheck, ShieldAlert, Plus, Edit, Users, ShoppingBag } from "lucide-react";
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
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Customer Directory</h1>
                    <p className="mt-1 text-gray-500 font-medium">Manage your community and user permissions.</p>
                </div>
                <Link
                    href="/admin/customers/new"
                    className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all active:scale-[0.95]"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    New Customer
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-xl overflow-hidden rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
                <ul role="list" className="divide-y divide-gray-50 dark:divide-gray-700">
                    {users.map((user: any) => (
                        <li key={user._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                            <div className="px-6 py-6 sm:px-10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div className="flex items-center min-w-0">
                                        <div className="flex-shrink-0">
                                            {user.image ? (
                                                <img className="h-14 w-14 rounded-2xl object-cover ring-2 ring-indigo-50 dark:ring-indigo-900/30 group-hover:scale-110 transition-transform duration-500" src={user.image} alt="" />
                                            ) : (
                                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500 uppercase">
                                                    {user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-5 min-w-0">
                                            <div className="text-base font-black text-gray-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">{user.name}</div>
                                            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">
                                                <Mail className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-indigo-400" />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row sm:flex-col items-center sm:items-center justify-between sm:justify-center gap-4 border-t border-gray-50 sm:border-0 pt-4 sm:pt-0 dark:border-gray-700/50">
                                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center ${user.role === 'admin'
                                            ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30"
                                            : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30"
                                            }`}>
                                            {user.role === 'admin' ? (
                                                <ShieldAlert className="mr-1.5 h-3 w-3" />
                                            ) : (
                                                <ShieldCheck className="mr-1.5 h-3 w-3" />
                                            )}
                                            {user.role}
                                        </div>
                                        <div className="flex items-center text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">
                                            <Calendar className="flex-shrink-0 mr-1.5 h-3 w-3" />
                                            {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 justify-end mt-2 sm:mt-0">
                                        <Link
                                            href={`/admin/customers/${user._id}/edit`}
                                            className="p-3 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-50 dark:bg-gray-800/50 rounded-2xl transition-all hover:scale-110"
                                            title="Edit Customer"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all hover:scale-110">
                                            <DeleteButton endpoint={`/api/admin/users/${user._id}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {users.length === 0 && (
                        <div className="p-20 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-50 dark:bg-gray-900 mb-6">
                                <Users className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">No customers found</h3>
                            <p className="mt-2 text-gray-500 max-w-xs mx-auto">Start growing your community by adding your first customer today.</p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}
