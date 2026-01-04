"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Loader2,
    Package,
    Tag,
    DollarSign,
    Layers,
    FileText,
    Image as ImageIcon,
    CheckCircle,
    Star,
    Zap,
    Flame,
    ArrowLeft,
    Plus,
    Trash2,
    Settings,
    Truck,
    RefreshCw
} from "lucide-react";

// Helper to slugify text
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/&/g, '-and-')   // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

interface ProductFormProps {
    initialData?: any;
    isEditing?: boolean;
}

interface Variant {
    type: string;
    value: string;
    priceAdjustment: number;
    stock: number;
    image: string;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<any[]>([]);

    // Initial State Setup
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        price: initialData?.price || 0,
        discount: initialData?.discount || 0,
        stock: initialData?.stock || 0,
        category: initialData?.category?._id || initialData?.category || "",
        images: initialData?.images?.length ? initialData.images : [""], // Array of strings
        externalId: initialData?.externalId || "",
        source: initialData?.source || "local",
        variants: initialData?.variants || [] as Variant[],
        isFeatured: initialData?.isFeatured || false,
        isNewArrival: initialData?.isNewArrival || false,
        isOnSale: initialData?.isOnSale || false,
        salePrice: initialData?.salePrice || 0,
    });

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        }
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: ["price", "stock", "salePrice", "discount"].includes(name)
                    ? parseFloat(value) || 0
                    : value
            }));
        }

        // Auto-generate slug from name if slug is empty or we want to be helpful
        if (name === "name" && !isEditing) {
            // Only auto-update if slug hasn't been manually touched? 
            // For now, let's just provide a manual button to sync, or a small logic here.
            // Let's keep it simple: if I change name, and slug looks like it was auto-generated from previous name (or empty), update it.
            // But checking "looks like" is hard. 
            // Let's just add a "Generate Slug" button in the UI instead of magic here.
        }
    };

    const handleGenerateSlug = () => {
        setFormData(prev => ({ ...prev, slug: slugify(prev.name) }));
    };

    // --- Image Handling ---
    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ""] }));
    };

    const removeImageField = (index: number) => {
        const newImages = formData.images.filter((_: string, i: number) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages.length ? newImages : [""] }));
    };

    // --- Variant Handling ---
    const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
        const newVariants = [...formData.variants];
        newVariants[index] = {
            ...newVariants[index],
            [field]: field === 'priceAdjustment' || field === 'stock' ? (parseFloat(value) || 0) : value
        };
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { type: "Color", value: "", priceAdjustment: 0, stock: 0, image: "" }]
        }));
    };

    const removeVariant = (index: number) => {
        const newVariants = formData.variants.filter((_: Variant, i: number) => i !== index);
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = isEditing
                ? `/api/products/${initialData?.slug}`
                : "/api/products";

            const method = isEditing ? "PUT" : "POST";

            // Filter out empty images
            const submitData = {
                ...formData,
                images: formData.images.filter((img: string) => img.trim() !== "")
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            });

            if (res.ok) {
                router.push("/admin/products");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.message || "Failed to save product");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto">
            {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-100 dark:border-rose-900 text-sm font-medium animate-shake">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Details */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                            <Package className="w-5 h-5 mr-2 text-indigo-500" /> Basic Information
                        </h3>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Product Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400"
                                placeholder="Wireless Bluetooth Headphones"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex justify-between">
                                    <span>Slug (URL)</span>
                                    <button
                                        type="button"
                                        onClick={handleGenerateSlug}
                                        className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center"
                                        title="Generate from Name"
                                    >
                                        <RefreshCw className="w-3 h-3 mr-1" /> Generate
                                    </button>
                                </label>
                                <input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="wireless-headphones"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 resize-none"
                                placeholder="Describe your product..."
                            />
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                <ImageIcon className="w-5 h-5 mr-2 text-purple-500" /> Product Images
                            </h3>
                            <button
                                type="button"
                                onClick={addImageField}
                                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-1" /> Add Image
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.images.map((url: string, index: number) => (
                                <div key={index} className="flex gap-3">
                                    <input
                                        value={url}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="flex-1 px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                    {formData.images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImageField(index)}
                                            className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Variants Section */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                <Layers className="w-5 h-5 mr-2 text-cyan-500" /> Product Variants
                            </h3>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-1" /> Add Variant
                            </button>
                        </div>

                        {formData.variants.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                No variants added. Product will be treated as a single item.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {formData.variants.map((variant: Variant, index: number) => (
                                    <div key={index} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                        <div className="md:col-span-3 space-y-1">
                                            <label className="text-xs font-bold text-gray-500">Type</label>
                                            <input
                                                value={variant.type}
                                                onChange={(e) => handleVariantChange(index, "type", e.target.value)}
                                                placeholder="Color/Size"
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-3 space-y-1">
                                            <label className="text-xs font-bold text-gray-500">Value</label>
                                            <input
                                                value={variant.value}
                                                onChange={(e) => handleVariantChange(index, "value", e.target.value)}
                                                placeholder="Red/XL"
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-xs font-bold text-gray-500">Price (+/-)</label>
                                            <input
                                                type="number"
                                                value={variant.priceAdjustment}
                                                onChange={(e) => handleVariantChange(index, "priceAdjustment", e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-xs font-bold text-gray-500">Stock</label>
                                            <input
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-12 space-y-1">
                                            <label className="text-xs font-bold text-gray-500">Variant Image URL (Optional)</label>
                                            <input
                                                value={variant.image || ""}
                                                onChange={(e) => handleVariantChange(index, "image", e.target.value)}
                                                placeholder="https://example.com/red-shirt.jpg"
                                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-12 flex justify-end pb-1">
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="p-2 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors flex items-center"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" /> Remove Variant
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Pricing & Status */}
                <div className="space-y-8">
                    {/* Pricing */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                            <DollarSign className="w-5 h-5 mr-2 text-emerald-500" /> Pricing & Inventory
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Base Price ($)</label>
                                <input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Discount (%)</label>
                                <input
                                    name="discount"
                                    type="number"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Total Stock</label>
                                <input
                                    name="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Metadata (Dropshipping) */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                            <Truck className="w-5 h-5 mr-2 text-blue-500" /> External Source
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">External ID</label>
                                <input
                                    name="externalId"
                                    value={formData.externalId}
                                    onChange={handleChange}
                                    placeholder="CJ-12345"
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Source</label>
                                <select
                                    name="source"
                                    value={formData.source}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                                >
                                    <option value="local">Local Inventory</option>
                                    <option value="cjdropshipping">CJ Dropshipping</option>
                                    <option value="aliexpress">AliExpress</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Status Flags */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Settings className="w-5 h-5 mr-2 text-gray-500" /> Visibility
                        </h3>

                        <div className="space-y-4">
                            <label className="flex items-center group cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-500 transition-colors flex items-center">
                                    <Star className={`w-4 h-4 mr-2 ${formData.isFeatured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} /> Featured Product
                                </span>
                            </label>

                            <label className="flex items-center group cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isNewArrival"
                                    checked={formData.isNewArrival}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-500 transition-colors flex items-center">
                                    <Zap className={`w-4 h-4 mr-2 ${formData.isNewArrival ? 'text-emerald-500 fill-emerald-500' : 'text-gray-400'}`} /> New Arrival
                                </span>
                            </label>

                            <label className="flex items-center group cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isOnSale"
                                    checked={formData.isOnSale}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-500 transition-colors flex items-center">
                                    <Flame className={`w-4 h-4 mr-2 ${formData.isOnSale ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} /> On Sale
                                </span>
                            </label>
                        </div>

                        {formData.isOnSale && (
                            <div className="pt-4 space-y-2 animate-fade-in-up">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
                                    <DollarSign className="w-4 h-4 mr-1 text-rose-500" /> Sale Price ($)
                                </label>
                                <input
                                    name="salePrice"
                                    type="number"
                                    step="0.01"
                                    value={formData.salePrice}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-2xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/30 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-bold"
                                />
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    {isEditing ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    {isEditing ? "Save Changes" : "Publish Product"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
