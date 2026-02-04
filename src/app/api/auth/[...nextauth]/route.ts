import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile(profile) {
                console.log(" Google profile() raw:", profile);

                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile }) {
            console.log(" signIn user:", user);
            console.log(" signIn account:", account);
            console.log(" signIn profile:", profile);
            return true;
        },

        async jwt({ token, account, profile, user }) {
            // Extend token type WITHOUT any
            const t = token as typeof token & {
                provider?: string;
                accessToken?: string;
                picture?: string;
                userId?: string;
            };

            if (account) {
                t.provider = account.provider;
                t.accessToken = account.access_token ?? undefined;

                console.log(" jwt account.access_token:", account.access_token);
            }

            // profile is "unknown-like" here, safely read picture
            if (profile && typeof profile === "object" && "picture" in profile) {
                const p = profile as Record<string, unknown>;
                if (typeof p.picture === "string") t.picture = p.picture;
            }

            if (user) {
                // user type doesn't include id in TS by default, but your profile() returns it
                const u = user as typeof user & { id?: string };
                if (u.id) t.userId = u.id;
            }

            console.log(" jwt token:", t);
            return t;
        },

        async session({ session, token }) {
            const t = token as typeof token & {
                accessToken?: string;
                userId?: string;
                picture?: string;
            };

            // Extend session type WITHOUT any
            const s = session as typeof session & {
                accessToken?: string;
                user: typeof session.user & { id?: string };
            };

            s.accessToken = t.accessToken;
            s.user.id = t.userId;
            if (t.picture) s.user.image = t.picture;

            console.log(" session:", s);
            return s;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };