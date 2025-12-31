import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// TEMPORARY ENDPOINT - Remove after fixing passwords
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, newPassword, adminSecret } = body;

        // Simple security check - you can set this in your .env
        const SECRET = process.env.ADMIN_RESET_SECRET || "temp-reset-secret-123";

        if (adminSecret !== SECRET) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!email || !newPassword) {
            return NextResponse.json({
                message: "Email and new password are required"
            }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({
                message: "Password must be at least 6 characters"
            }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({
                message: `User not found: ${email}`
            }, { status: 404 });
        }

        console.log('🔐 Resetting password for:', email);

        // Hash the password manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update directly without triggering save hooks
        await User.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );

        console.log('✅ Password reset successfully for:', email);

        return NextResponse.json({
            message: `Password reset successfully for ${email}. You can now log in with your new password.`,
            success: true
        });

    } catch (error: any) {
        console.error("Password reset error:", error);
        return NextResponse.json({
            message: error.message || "Failed to reset password"
        }, { status: 500 });
    }
}
