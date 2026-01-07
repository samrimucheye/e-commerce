"use client";

export default function ShippingPolicy() {
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen py-16 transition-colors duration-300">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 border-b dark:border-gray-800 pb-4">
                    Shipping Policy
                </h1>

                <div className="space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Order Processing</h2>
                        <p>
                            All orders are processed within 1-3 business days. Orders are not shipped or delivered on weekends or holidays.
                            If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Shipping Rates & Delivery Estimates</h2>
                        <p className="mb-4">
                            Shipping charges for your order will be calculated and displayed at checkout.
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
                            <ul className="space-y-2">
                                <li className="flex justify-between border-b dark:border-gray-700 pb-2">
                                    <span className="font-semibold text-gray-900 dark:text-white">Standard Shipping</span>
                                    <span>5-10 business days</span>
                                </li>
                                <li className="flex justify-between border-b dark:border-gray-700 pb-2">
                                    <span className="font-semibold text-gray-900 dark:text-white">Express Shipping</span>
                                    <span>2-4 business days</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="font-semibold text-gray-900 dark:text-white">International Shipping</span>
                                    <span>Varies by location</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Shipment Confirmation & Order Tracking</h2>
                        <p>
                            You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s).
                            The tracking number will be active within 24 hours.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Customs, Duties, and Taxes</h2>
                        <p>
                            The Store is not responsible for any customs and taxes applied to your order.
                            All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Damages</h2>
                        <p>
                            The Store is not liable for any products damaged or lost during shipping.
                            If you received your order damaged, please contact the shipment carrier to file a claim.
                            Please save all packaging materials and damaged goods before filing a claim.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
