import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard from "@/components/product/ProductCard";

async function getProducts({ search, category }: { search?: string, category?: string }) {
    try {
        await dbConnect();

        const query: any = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) {
            // Check if it's a valid ObjectId if searching by ID
            if (mongoose.Types.ObjectId.isValid(category)) {
                query.category = category;
            } else {
                // If it's a slug or name, we might need a different approach, 
                // but for now let's assume it should be an ID or we ignore invalid ones
                console.warn(`Invalid category ID provided: ${category}`);
            }
        }

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .populate('category');

        return JSON.parse(JSON.stringify(products));
    } catch (error: any) {
        console.error("Error in getProducts:", error);
        return []; // Return empty array on error to prevent page crash
    }
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; category?: string }>;
}) {
    const filters = await searchParams;
    const products = await getProducts({
        search: filters.search,
        category: filters.category
    });

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">All Products</h2>

                {/* Simple Search/Filter Mockup could go here */}

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.length > 0 ? (
                        products.map((product: any) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-10">
                            No products found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
