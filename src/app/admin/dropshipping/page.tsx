"use client";

import { useState } from "react";
import { Search, Loader2, Download, ExternalLink, PackageCheck } from "lucide-react";

export default function DropshippingPage() {
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [error, setError] = useState("");

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/dropshipping?keyword=${encodeURIComponent(keyword)}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data.data?.list || []);
            } else {
                setError("Failed to fetch products from CJ");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleImport(pid: string) {
        setImporting(pid);
        try {
            const res = await fetch("/api/dropshipping/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pid }),
            });

            if (res.ok) {
                alert("Product imported successfully!");
            } else {
                const err = await res.json();
                alert(err.message || "Failed to import product");
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setImporting(null);
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">CJ Dropshipping Sourcing</h1>
            </div>

            <form onSubmit={handleSearch} className="max-w-2xl flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search products on CJ Dropshipping..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Search"}
                </button>
            </form>

            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.pid} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="relative aspect-square">
                            <img
                                src={product.productImage}
                                alt={product.productNameEn}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-900">
                                ${product.sellPrice.toFixed(2)}
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{product.productNameEn}</h3>
                            <div className="flex items-center text-xs text-gray-500 mb-4">
                                <PackageCheck className="h-3 w-3 mr-1" />
                                Category: {product.categoryName}
                            </div>
                            <div className="mt-auto flex items-center gap-2">
                                <button
                                    onClick={() => handleImport(product.pid)}
                                    disabled={importing === product.pid}
                                    className="flex-1 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 disabled:opacity-50 flex items-center justify-center"
                                >
                                    {importing === product.pid ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Download className="h-4 w-4 mr-2" />
                                    )}
                                    Import
                                </button>
                                <a
                                    href={`https://cjdropshipping.com/product-detail.html?productID=${product.pid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                    title="View on CJ"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                    Search for products to source from CJ Dropshipping.
                </div>
            )}
        </div>
    );
}
