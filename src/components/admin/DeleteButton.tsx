"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

interface DeleteButtonProps {
    endpoint: string;
    onSuccess?: () => void;
}

export default function DeleteButton({ endpoint, onSuccess }: DeleteButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this item?")) return;

        setLoading(true);
        try {
            const res = await fetch(endpoint, {
                method: "DELETE",
            });

            if (res.ok) {
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.refresh();
                }
            } else {
                const err = await res.json();
                alert(err.message || "Failed to delete item");
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-red-400 hover:text-red-500 disabled:opacity-50"
            title="Delete"
        >
            <Trash className="h-5 w-5" />
        </button>
    );
}
