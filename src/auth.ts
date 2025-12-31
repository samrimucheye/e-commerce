import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import dbConnect from './lib/db';
import User from './models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    console.log('❌ Validation failed:', parsedCredentials.error.issues);
                    return null;
                }

                const { email, password } = parsedCredentials.data;
                console.log('🔍 Attempting login for:', email);

                try {
                    await dbConnect();
                    const user = await User.findOne({ email }).select('+password');

                    if (!user) {
                        console.log('❌ User not found:', email);
                        return null;
                    }

                    if (!user.password) {
                        console.log('❌ User has no password set:', email);
                        return null;
                    }

                    console.log('🔐 Comparing passwords...');
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) {
                        console.log('✅ Login successful for:', email);
                        return user;
                    } else {
                        console.log('❌ Password mismatch for:', email);
                        return null;
                    }
                } catch (error) {
                    console.error('❌ Auth error:', error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session.user };
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
});
