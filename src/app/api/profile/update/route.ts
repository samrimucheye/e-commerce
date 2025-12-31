import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function PUT(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, address, city, postalCode, country } = body;

        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }

        await dbConnect();

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            {
                name,
                address,
                city,
                postalCode,
                country,
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                address: updatedUser.address,
                city: updatedUser.city,
                postalCode: updatedUser.postalCode,
                country: updatedUser.country,
            }
        });

    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: error.message || "Failed to update profile" }, { status: 500 });
    }
}
