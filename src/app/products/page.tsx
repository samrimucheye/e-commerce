import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard from "@/components/product/ProductCard";
import CategoryFilter from "@/components/product/CategoryFilter";
import ProductSort from "@/components/product/ProductSort";

async function getProducts({ search, category, sort }: { search?: string, category?: string, sort?: string }) {
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
            if (mongoose.Types.ObjectId.isValid(category)) {
                query.category = category;
            }
        }

        // Sorting logic
        let sortQuery: any = { createdAt: -1 }; // Default: Newest
        if (sort === 'price-asc') sortQuery = { price: 1 };
        if (sort === 'price-desc') sortQuery = { price: -1 };

        const products = await Product.find(query)
            .sort(sortQuery)
            .populate('category');

        return JSON.parse(JSON.stringify(products));
    } catch (error: any) {
        console.error("Error in getProducts:", error);
        return [];
    }
}



// Fetch categories helper
async function getCategories() {
    await dbConnect();
    const categories = await Category.find({}).lean();
    return JSON.parse(JSON.stringify(categories));
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; category?: string; sort?: string }>;
}) {
    const filters = await searchParams;

    // Fetch data in parallel
    const [products, categories] = await Promise.all([
        getProducts({
            search: filters.search,
            category: filters.category,
            sort: filters.sort
        }),
        getCategories()
    ]);

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-gray-800 pb-8 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Our Collection</h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {products.length} products found
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
                            <CategoryFilter categories={categories} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                            <ProductSort />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.length > 0 ? (
                        products.map((product: any) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
                            <div className="mx-auto max-w-xs">
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">No products found</p>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    We couldn't find anything matching your filters. Try adjusting your search or category.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
