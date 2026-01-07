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

            if (nextUrl.pathname.startsWith("/admin")) {
                if (!isLoggedIn) {
                    return Response.redirect(new URL("/login", nextUrl));
                }
                if ((auth.user as any).role !== "admin") {
                    return Response.redirect(new URL("/", nextUrl));
                }
            }

            if (
                isLoggedIn &&
                (nextUrl.pathname === "/login" ||
                    nextUrl.pathname === "/register")
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
