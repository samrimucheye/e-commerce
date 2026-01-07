import dbConnect from "@/lib/db";
import User from "@/models/User";
import UserForm from "@/components/admin/UserForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

async function getUser(id: string) {
    await dbConnect();
    const user = await User.findById(id).select("-password");
    if (!user) return null;
    return JSON.parse(JSON.stringify(user));
}

export default async function EditCustomerPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const user = await getUser(id);

    if (!user) {
        return notFound();
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
                <Link
                    href="/admin/customers"
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> back to Customers
                </Link>
            </div>

            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Edit Customer</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Modifying {user.name}'s profile and account settings.
                </p>
            </div>

            <UserForm initialData={user} isEditing={true} />
        </div>
    );
}
