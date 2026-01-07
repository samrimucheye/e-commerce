import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth((req) => {
    return intlMiddleware(req);
});

export const config = {
    // Matcher that handles internationalization and authentication
    matcher: [
        '/',
        '/(de|en|es|fr|ar|he|am)/:path*',
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ]
};
