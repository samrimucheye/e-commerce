import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import dbConnect from './lib/db';
import User from './models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
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
                    console.log('🔌 Connecting to database...');
                    await dbConnect();

                    console.log('Searching for user:', email);
                    const user = await User.findOne({ email }).select('+password');

                    if (!user) {
                        console.warn('⚠️ Login failed: User not found ->', email);
                        return null;
                    }

                    if (!user.password) {
                        console.warn('⚠️ Login failed: No password hash for user ->', email);
                        return null;
                    }

                    console.log('🔐 Comparing passwords...');
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) {
                        console.log('✅ Login successful for:', email);
                        return user;
                    } else {
                        console.warn('⚠️ Login failed: Password mismatch for ->', email);
                        return null;
                    }
                } catch (error: any) {
                    console.error('🔥 CRITICAL AUTH ERROR:', {
                        message: error.message,
                        stack: error.stack,
                        email: email
                    });
                    return null;
                }
            },
        }),
    ],
});
