import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth((req) => {
    // Skip internationalization for API routes, auth routes, and static files
    const pathname = req.nextUrl.pathname;
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.')
    ) {
        return;
    }

    // Apply internationalization middleware for page routes
    return intlMiddleware(req);
});

export const config = {
    // Matcher that handles internationalization and authentication
    // Excludes: _next/static, _next/image, favicon.ico, and other static files
    // Includes: all pages (with locale prefixes) and API routes
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
    ]
};
