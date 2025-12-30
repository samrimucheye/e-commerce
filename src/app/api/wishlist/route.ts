import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email })
            .populate({
                path: 'wishlist',
                model: Product,
                options: { strictPopulate: false }
            });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(JSON.parse(JSON.stringify(user.wishlist)));
    } catch (error) {
        console.error("WISHLIST_GET_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Ensure wishlist exists
        if (!user.wishlist) {
            user.wishlist = [];
        }

        const index = user.wishlist.indexOf(productId as any);
        let action: 'added' | 'removed';

        if (index === -1) {
            user.wishlist.push(productId as any);
            action = 'added';
        } else {
            user.wishlist.splice(index, 1);
            action = 'removed';
        }

        await user.save();

        return NextResponse.json({
            action,
            wishlist: JSON.parse(JSON.stringify(user.wishlist))
        });
    } catch (error) {
        console.error("WISHLIST_POST_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
