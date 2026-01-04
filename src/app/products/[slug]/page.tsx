import Image from "next/image";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category"; // Ensure registration
import AddToCart from "./AddToCart";
import ProductGallery from "@/components/product/ProductGallery";

import { isValidObjectId } from "mongoose";

async function getProduct(slug: string) {
    await dbConnect();

    let query: any = { slug };

    // Fallback: If slug looks like an ObjectId, try finding by ID if slug not found
    // Or, check if we can query by $or logic.
    // However, if a product has a slug that looks like an ID, priority should be slug.

    let product = await Product.findOne({ slug }).populate('category');

    if (!product && isValidObjectId(slug)) {
        product = await Product.findById(slug).populate('category');
    }

    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="pt-6">
                <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-12 lg:px-8 lg:pt-16">
                    {/* Gallery Section */}
                    <div className="lg:col-span-1 lg:row-span-3">
                        <ProductGallery images={product.images || []} name={product.name} />
                    </div>

                    {/* Options */}
                    <div className="mt-8 lg:mt-0">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">{product.name}</h1>

                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                            {/*  Client component for interaction - now handles Price display too */}
                            <AddToCart product={product} />
                        </div>
                    </div>
                </div>

                {/* Description & Details (Below fold) */}
                <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                    <div className="lg:col-span-3 border-t border-gray-200 dark:border-gray-800 pt-10">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Description</h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                            <p>{product.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
