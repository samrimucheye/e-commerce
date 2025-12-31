import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: "Current and new passwords are required" }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ message: "New password must be at least 6 characters" }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findById(session.user.id).select("+password");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (!user.password) {
            return NextResponse.json({ message: "Account setup incomplete" }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            console.log('❌ Current password incorrect for user:', user.email);
            return NextResponse.json({ message: "Invalid current password" }, { status: 400 });
        }

        console.log('🔐 Changing password for user:', user.email);

        // The pre-save hook in User model will handle the hashing
        user.password = newPassword;
        await user.save();

        console.log('✅ Password changed successfully for:', user.email);

        return NextResponse.json({ message: "Password updated successfully" });

    } catch (error: any) {
        console.error("Password update error:", error);
        return NextResponse.json({ message: error.message || "Failed to update password" }, { status: 500 });
    }
}
