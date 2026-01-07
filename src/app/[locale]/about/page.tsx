import { Info, Target, ShieldCheck } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Our Story</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400">
                        Founded with a passion for quality and innovation, we've been delivering excellence since day one.
                    </p>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        <div className="text-center">
                            <div className="flex justify-center">
                                <Info className="h-12 w-12 text-indigo-600" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">Who We Are</h3>
                            <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">
                                We are a team of dedicated professionals committed to providing the best shopping experience for our customers.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="flex justify-center">
                                <Target className="h-12 w-12 text-indigo-600" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">Our Mission</h3>
                            <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">
                                To revolutionize the way people shop online by offering premium products at unbeatable prices.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="flex justify-center">
                                <ShieldCheck className="h-12 w-12 text-indigo-600" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">Integrity Second</h3>
                            <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">
                                We believe in absolute transparency and ethical sourcing for every item in our inventory.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 p-8 sm:p-12">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-bold tracking-tight text-indigo-900 dark:text-indigo-100">Ready to start shopping?</h2>
                            <p className="mt-4 text-lg text-indigo-700 dark:text-indigo-300">
                                Explore our curated collection of high-quality products today.
                            </p>
                        </div>
                        <div className="mt-10 flex items-center lg:mt-0 lg:ml-8 lg:flex-shrink-0">
                            <a
                                href="/products"
                                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700 transition"
                            >
                                Browse Collections
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
