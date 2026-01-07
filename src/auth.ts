import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "./lib/db";
import User from "./models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,

    providers: [
        Credentials({
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                // ✅ Validate input
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(6),
                    })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    console.error("❌ Invalid credentials format");
                    return null;
                }

                const { email, password } = parsedCredentials.data;

                try {
                    // ✅ Connect once (serverless safe if dbConnect is cached)
                    await dbConnect();

                    // ✅ Fetch user + password
                    const user = await User.findOne({ email }).select("+password");

                    if (!user || !user.password) {
                        console.warn("⚠️ Login failed: user not found");
                        return null;
                    }

                    // ✅ Compare password
                    const isPasswordValid = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        console.warn("⚠️ Login failed: password mismatch");
                        return null;
                    }

                    // ✅ IMPORTANT: return PLAIN object (NOT mongoose document)
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name ?? user.email,
                        role: user.role,
                    };
                } catch (error: any) {
                    console.error("🔥 AUTH ERROR:", error);
                    return null;
                }
            },
        }),
    ],
});
