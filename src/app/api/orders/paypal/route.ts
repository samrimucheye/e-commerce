import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';

const PAYPAL_API = process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

// Helper to get access token
async function generateAccessToken() {
    try {
        if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(
            process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET
        ).toString("base64");

        const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
        return null;
    }
}

// POST: Create Order
export async function POST(req: Request) {
    try {
        const { items, shippingAddress } = await req.json(); // Read req.json() once

        await dbConnect();

        const session = await auth();
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!items || items.length === 0) {
            return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
        }

        if (!shippingAddress) {
            return NextResponse.json({ message: "Shipping address is required" }, { status: 400 });
        }

        // Update User with latest shipping info
        await User.findByIdAndUpdate(session.user.id, {
            address: shippingAddress.address,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
        });

        // Calculate total on server and verify product prices
        let totalAmount = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return NextResponse.json({ message: `Product not found: ${item.productId}` }, { status: 404 });
            }
            // Use the product's price from the database to prevent client-side price manipulation
            totalAmount += product.price * item.quantity;
            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images[0] || '',
                price: product.price,
                quantity: item.quantity,
                variant: item.variant // Assuming variant is passed and valid
            });
        }

        // Create Order in DB (Pending)
        const order = await Order.create({
            user: session.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress: {
                fullName: shippingAddress.fullName,
                address: shippingAddress.address,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country
            },
            status: 'pending',
            isPaid: false
        });

        const accessToken = await generateAccessToken();
        if (!accessToken) {
            return NextResponse.json({ message: "Failed to generate PayPal access token" }, { status: 500 });
        }

        const url = `${PAYPAL_API}/v2/checkout/orders`;

        // Ensure Base URL is valid
        // Ensure Base URL is valid (handle 'undefined' string case)
        let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        if (!baseUrl || baseUrl === "undefined") {
            baseUrl = "http://localhost:3000";
        }

        const payload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: totalAmount.toFixed(2),
                    },
                    // Custom ID to link PayPal order to our internal order
                    custom_id: order._id.toString(),
                },
            ],
            // Optional: Add application context for return URLs
            application_context: {
                return_url: `${baseUrl}/order/${order._id}/success`,
                cancel_url: `${baseUrl}/order/${order._id}/cancel`,
                shipping_preference: "NO_SHIPPING", // We collect address ourselves
                user_action: "PAY_NOW"
            }
        };

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            method: "POST",
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("PayPal Create Order Failed:", data);
            return NextResponse.json({
                message: "PayPal Error",
                details: data,
                sentPayload: payload // sending payload back to client for debug
            }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Capture Order and Save to DB
export async function PUT(req: Request) {
    try {
        const { orderID } = await req.json();
        const session = await auth();
        const accessToken = await generateAccessToken();

        const url = `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        if (data.status === 'COMPLETED') {
            await dbConnect();

            // Find the pending order created in the POST block
            // The custom_id was set to the Mongo Order _id
            const capture = data.purchase_units[0].payments.captures[0];
            const originalOrderId = capture.custom_id;

            if (!originalOrderId) {
                return NextResponse.json({ message: "No custom_id found in PayPal capture to link with DB order." }, { status: 400 });
            }

            const existingOrder = await Order.findById(originalOrderId);
            if (!existingOrder) {
                return NextResponse.json({ message: "Original order not found in DB." }, { status: 404 });
            }

            // Update the existing order to Paid
            existingOrder.status = 'paid';
            existingOrder.isPaid = true;
            existingOrder.paidAt = new Date();
            existingOrder.paymentResult = {
                id: data.id,
                status: data.status,
                email_address: data.payer.email_address
            };

            await existingOrder.save();

            // Trigger n8n Webhook for CJ Items
            const webhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/new-order';

            for (const item of existingOrder.items) {
                // Assume the variant string holds the CJ Variant ID if it exists.
                // In a full implementation, you'd check the Product model to see if it's a CJ product.
                if (item.variant) {
                    const payload = {
                        order_id: existingOrder._id.toString(),
                        cj_variant_id: item.variant,
                        quantity: item.quantity,
                        customer: {
                            name: existingOrder.shippingAddress.fullName,
                            email: data.payer.email_address || session?.user?.email, // PayPal buyer email
                            phone: "0000000000", // Fallback, could prompt user for this at checkout
                            address: existingOrder.shippingAddress.address,
                            city: existingOrder.shippingAddress.city,
                            country: existingOrder.shippingAddress.country,
                            zip: existingOrder.shippingAddress.postalCode
                        }
                    };

                    try {
                        const whResponse = await fetch(webhookUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });

                        if (!whResponse.ok) {
                            console.error(`Failed to trigger n8n webhook for order ${existingOrder._id}`, await whResponse.text());
                        }
                    } catch (whError) {
                        console.error("n8n Webhook Error:", whError);
                    }
                }
            }
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
