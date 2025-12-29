import Link from "next/link";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import ProductCard from "@/components/product/ProductCard";
import HeroSlider from "@/components/home/HeroSlider";

// Ensure model is registered
import "@/models/Category";

async function getFeaturedProducts() {
  await dbConnect();
  // We can filter by isFeatured: true in production, 
  // but for now just take the latest 4 to ensure something shows
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(4).populate('category');
  return JSON.parse(JSON.stringify(products)); // Serialize for client component
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div className="bg-white dark:bg-gray-900">
      <HeroSlider />

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Featured Products</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No products found. Start by adding some from the admin panel!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
