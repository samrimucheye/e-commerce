import dbConnect from "@/lib/db";
import User from "@/models/User";
import { Mail, Calendar, ShieldCheck, ShieldAlert } from "lucide-react";

async function getUsers() {
    await dbConnect();
    const users = await User.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(users));
}

export default async function AdminCustomersPage() {
    const users = await getUsers();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Customers</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {users.map((user: any) => (
                        <li key={user._id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {user.image ? (
                                                <img className="h-10 w-10 rounded-full" src={user.image} alt="" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-indigo-600">{user.name}</div>
                                            <div className="flex items-center text-sm text-gray-400">
                                                <Mail className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {user.role === 'admin' ? (
                                                <ShieldAlert className="mr-1 h-3 w-3 text-red-500" />
                                            ) : (
                                                <ShieldCheck className="mr-1 h-3 w-3 text-green-500" />
                                            )}
                                            {user.role}
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                            Joined {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {users.length === 0 && (
                        <div className="px-4 py-8 text-center text-gray-500">
                            No customers found.
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}
