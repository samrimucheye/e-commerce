import { auth } from '@/auth';

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;
    const { pathname } = nextUrl;

    // Define paths
    const isOnDashboard = pathname.startsWith('/admin');
    const isOnCheckout = pathname.startsWith('/checkout');
    const isOnLogin = pathname.startsWith('/login');
    const isOnRegister = pathname.startsWith('/register');

    // Route protection
    if (isOnDashboard || isOnCheckout) {
        if (!isLoggedIn) {
            const loginUrl = new URL('/login', nextUrl);
            loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
            return Response.redirect(loginUrl);
        }

        if (isOnDashboard && (req.auth?.user as any)?.role !== 'admin') {
            return Response.redirect(new URL('/', nextUrl));
        }
    }

    // Redirect logged-in users away from auth pages
    if (isOnLogin || isOnRegister) {
        if (isLoggedIn) {
            return Response.redirect(new URL('/', nextUrl));
        }
    }

    return;
});

export const config = {
    // Matcher ignoring helper files and static assets
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
