import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const proxy = NextAuth(authConfig).auth;

export const config = {
    // Matcher from previous proxy.ts ignoring helper files and static assets
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
