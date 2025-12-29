"use client";

export default function TermsOfService() {
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen py-16 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 border-b dark:border-gray-800 pb-4">
                    Terms of Service
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-10">Last updated: December 29, 2025</p>

                <div className="space-y-10 text-gray-600 dark:text-gray-400 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                            In addition, when using this websites particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Privacy Policy</h2>
                        <p>
                            Your privacy is very important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.
                            By using our services, you agree that we can use such data in accordance with our privacy policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Products and Pricing</h2>
                        <p>
                            All products listed on the website are subject to availability.
                            We reserve the right to change prices for products displayed on the website at any time and to correct pricing errors that may inadvertently occur.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Intellectual Property</h2>
                        <p>
                            The Service and its original content, features, and functionality are and will remain the exclusive property of the Store and its licensors.
                            Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the Store.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Limitation of Liability</h2>
                        <p>
                            In no event shall the Store, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </section>

                    <section className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border dark:border-gray-700 mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
                        <p className="mb-0">
                            If you have any questions about these Terms, please contact us at: <br />
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">support@ecommerce-store.com</span>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
