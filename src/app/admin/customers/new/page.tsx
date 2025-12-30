import UserForm from "@/components/admin/UserForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCustomerPage() {
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
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Add New Customer</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Create a new user account with custom roles and addresses.
                </p>
            </div>

            <UserForm />
        </div>
    );
}
