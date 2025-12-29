import Image from "next/image";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category"; // Ensure registration
import AddToCart from "./AddToCart";

async function getProduct(slug: string) {
    await dbConnect();
    const product = await Product.findOne({ slug }).populate('category');
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
                <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16">
                    {/* Image */}
                    <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
                        <Image
                            src={product.images[0] || "https://placehold.co/600x600"}
                            alt={product.name}
                            width={600}
                            height={600}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>

                    {/* Mobile Image */}
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg lg:hidden mb-6">
                        <Image
                            src={product.images[0] || "https://placehold.co/600x600"}
                            alt={product.name}
                            width={600}
                            height={600}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>

                    {/* Options */}
                    <div className="mt-4 lg:row-span-3 lg:mt-0">
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl tracking-tight text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>

                        <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6">
                            {/*  Client component for interaction */}
                            <AddToCart product={product} />
                        </div>
                    </div>

                    <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">{product.name}</h1>
                        </div>

                        <div className="mt-10">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Description</h3>
                            <div className="mt-4 space-y-6">
                                <p className="text-base text-gray-900 dark:text-gray-300">{product.description}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Category</h3>
                            <div className="mt-4 space-y-6">
                                <p className="text-base text-gray-900 dark:text-gray-300">{product.category?.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
