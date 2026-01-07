import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-12 overflow-y-auto max-w-full">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
