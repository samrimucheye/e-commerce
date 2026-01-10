import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            // Remove locale prefix to check actual route
            const pathname = nextUrl.pathname;
            const pathWithoutLocale = pathname.replace(/^\/(en|es|fr|de|ar|he|am)/, '');

            // Check if accessing admin routes (with or without locale prefix)
            if (pathWithoutLocale.startsWith("/admin")) {
                if (!isLoggedIn) {
                    return Response.redirect(new URL("/login", nextUrl));
                }
                if ((auth.user as any).role !== "admin") {
                    return Response.redirect(new URL("/", nextUrl));
                }
            }

            // Check if accessing checkout (require authentication)
            if (pathWithoutLocale.startsWith("/checkout")) {
                if (!isLoggedIn) {
                    const loginUrl = new URL("/login", nextUrl);
                    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
                    return Response.redirect(loginUrl);
                }
            }

            if (
                isLoggedIn &&
                (pathWithoutLocale === "/login" ||
                    pathWithoutLocale === "/register")
            ) {
                return Response.redirect(new URL("/", nextUrl));
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id as string;
            (session.user as any).role = token.role as string;
            return session;
        },
    },

    providers: [
        /* at least one provider REQUIRED */
    ],
} satisfies NextAuthConfig;
