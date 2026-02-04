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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">CJ Sourcing</h1>
                    <p className="mt-1 text-gray-500 font-medium">Find and import winning products directly from CJ Dropshipping.</p>
                    <p className="mt-2 text-sm text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg inline-block">
                        ✨ Tip: You can now search directly by SKU (e.g. CJYD247547416PK)
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl">
                <form onSubmit={handleSearch} className="max-w-3xl flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Search by Product Name or SKU (e.g. CJYD...)..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 font-bold transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 shadow-lg shadow-indigo-600/20 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center transition-all active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Find Products"}
                    </button>
                </form>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-100 dark:border-rose-900/30 text-sm font-bold">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                    <div key={product.pid} className="group bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-500 hover:border-indigo-500/30">
                        <div className="relative aspect-square overflow-hidden">
                            <img
                                src={product.productImage}
                                alt={product.productNameEn}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-xl px-3 py-1.5 rounded-xl text-sm font-black text-gray-900 dark:text-white">
                                ${Number(product.sellPrice || 0).toFixed(2)}
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="font-black text-gray-900 dark:text-white text-sm mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">{product.productNameEn}</h3>
                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                                <PackageCheck className="h-3 w-3 mr-1.5 text-indigo-500" />
                                {product.categoryName}
                            </div>
                            <div className="mt-auto flex items-center gap-3">
                                <button
                                    onClick={() => handleImport(product.pid)}
                                    disabled={importing === product.pid}
                                    className="flex-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-indigo-100 dark:hover:bg-indigo-900/40 disabled:opacity-50 flex items-center justify-center transition-all active:scale-[0.95]"
                                >
                                    {importing === product.pid ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Download className="h-4 w-4 mr-2" />
                                    )}
                                    Import
                                </button>
                                <a
                                    href={`https://cjdropshipping.com/product/${product.productNameEn?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'item'}-${product.pid}.html`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 text-gray-400 hover:text-indigo-600 bg-slate-50 dark:bg-gray-900 rounded-2xl transition-all hover:scale-110"
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
                <div className="p-20 text-center bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-50 dark:bg-gray-900 mb-6 transition-transform group-hover:scale-110">
                        <Search className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Find Products to Source</h3>
                    <p className="mt-2 text-gray-500 max-w-xs mx-auto font-medium">Use the search bar above to discover and import winning products from CJ Dropshipping.</p>
                </div>
            )}
        </div>
    );
}
