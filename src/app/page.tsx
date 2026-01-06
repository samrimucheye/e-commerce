import Link from "next/link";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import ProductCard from "@/components/product/ProductCard";
import HeroSlider from "@/components/home/HeroSlider";
import AnimatedSection from "@/components/animations/AnimatedSection";
import HomeNewsletterForm from "@/components/home/HomeNewsletterForm";

// Ensure model is registered
import "@/models/Category";

async function getHomeData() {
  await dbConnect();

  // Featured products (isFeatured: true)
  const featuredProducts = await Product.find({ isFeatured: true })
    .limit(4)
    .populate('category');

  // New Arrivals (isNewArrival: true or top 4 by createdAt)
  const newArrivals = await Product.find({
    $or: [{ isNewArrival: true }, {}]
  })
    .sort({ createdAt: -1 })
    .limit(4)
    .populate('category');

  // Products on sale
  const saleProducts = await Product.find({
    $or: [{ isOnSale: true }, { discount: { $gt: 0 } }]
  })
    .limit(4)
    .populate('category');

  return JSON.parse(JSON.stringify({
    featured: featuredProducts.length > 0 ? featuredProducts : newArrivals, // Fallback if no featured
    newArrivals,
    sale: saleProducts
  }));
}

export default async function Home() {
  const { featured, newArrivals, sale } = await getHomeData();

  return (
    <div className="bg-white dark:bg-gray-900 overflow-hidden">
      <HeroSlider />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-32">

        {/* Featured Section */}
        <AnimatedSection>
          <section>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Featured Selection</h2>
                <div className="h-1.5 w-20 bg-indigo-600 mt-2 rounded-full" />
              </div>
              <Link href="/products" className="group flex items-center text-indigo-600 hover:text-indigo-500 font-bold transition-all">
                View catalog <span className="ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product: any, idx: number) => (
                <AnimatedSection key={product._id} delay={idx * 0.1}>
                  <ProductCard product={product} />
                </AnimatedSection>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* New Arrivals Section */}
        <AnimatedSection direction="up" delay={0.2}>
          <section className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-100 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center py-12">
              <span className="bg-white dark:bg-gray-900 px-8 text-4xl font-black tracking-tight text-gray-900 dark:text-white">New Arrivals</span>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {newArrivals.map((product: any, idx: number) => (
                <AnimatedSection key={product._id} delay={idx * 0.1 + 0.3}>
                  <ProductCard product={product} />
                </AnimatedSection>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* Sale Section */}
        <AnimatedSection direction="left">
          <section className="bg-slate-50 dark:bg-slate-900/50 -mx-4 px-4 py-20 sm:-mx-6 sm:px-12 lg:-mx-8 lg:px-24 rounded-[3rem] border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            {/* Background Decorative Blob */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />

            <div className="flex items-center justify-between mb-12 relative z-10">
              <div>
                <h2 className="text-4xl font-black tracking-tight text-rose-600 dark:text-rose-400">Flash Sale</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Limited time offers. Grab them before they're gone!</p>
              </div>
              <Link href="/products" className="group flex items-center text-rose-600 hover:text-rose-500 font-bold transition-all">
                Shop all deals <span className="ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
              {sale.length > 0 ? (
                sale.map((product: any, idx: number) => (
                  <AnimatedSection key={product._id} delay={idx * 0.1}>
                    <ProductCard product={product} />
                  </AnimatedSection>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-400 font-medium italic">
                  New deals coming soon. Stay tuned!
                </div>
              )}
            </div>
          </section>
        </AnimatedSection>

        {/* Global Features Trust Bar */}
        <section className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-4 lg:gap-x-8 border-t border-slate-100 dark:border-slate-800 pt-24 pb-12">
          {[
            { name: 'Free Shipping', description: 'Global delivery on all orders', icon: '🚚' },
            { name: 'Pure Protection', description: '30-day premium guarantee', icon: '🛡️' },
            { name: 'Secure Flow', description: 'End-to-end encrypted checkout', icon: '🔒' },
            { name: 'Pro Support', description: 'Expert assistance 24/7', icon: '🎧' },
          ].map((feature, idx) => (
            <AnimatedSection key={feature.name} delay={idx * 0.15} direction="up">
              <div className="group flex flex-col items-center text-center p-8 rounded-[2rem] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6 border border-slate-100 dark:border-slate-700">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{feature.name}</h3>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </section>

        {/* Newsletter Section */}
        <AnimatedSection direction="up" delay={0.4}>
          <section className="relative isolate overflow-hidden bg-slate-950 px-6 py-24 shadow-2xl rounded-[4rem] sm:px-12 lg:py-32 border border-slate-800">
            <div className="absolute inset-0 -z-10 opacity-30">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.3),transparent)]" />
            </div>

            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">Elevate your experience.</h2>
              <p className="mt-6 text-xl leading-relaxed text-slate-300 font-medium">
                Join our premium inner circle and receive exclusive updates, early access to new collections, and a <span className="text-indigo-400 font-bold">15% welcome gift</span>.
              </p>
              <HomeNewsletterForm />
            </div>
          </section>
        </AnimatedSection>

      </div>
    </div>
  );
}
