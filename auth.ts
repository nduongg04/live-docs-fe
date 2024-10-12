import { access } from "fs";
import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },

            authorize: async (credentials) => {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password,
                            }),
                        },
                    );
                    const data = await res.json();
                    if (res.ok && data) {
                        const { _id: id, ...rest } = data.user;
                        return {
                            token: {
                                access_token: data.access_token,
                                refresh_token: data.refresh_token,
                            },
                            id,
                            ...rest,
                        };
                    }
                    return null;
                } catch (error) {
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.token!.access_token;
                token.refreshToken = user.token!.refresh_token;
                // const { token: tokenOnUser, ...rest } = user;
                token.user = {
                    id: user.id,
                    email: user.email,
                    displayName: user.displayName,
                    avatar: user.avatar,
                };
                return token;
            }
            const decodedAccessToken = jwtDecode(token.accessToken);
            if (decodedAccessToken.exp! > Date.now() / 1000) {
                return token;
            }
            console.log("Refresh token");
            if (!token.refreshToken) {
                throw new TypeError("Missing refresh_token");
            }
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token.refreshToken}`,
                        },
                    },
                );
                const data = await res.json();
                if (!res.ok) throw data;
                token.accessToken = data.access_token;
                if (data.refresh_token) token.refreshToken = data.refresh_token;
                return token;
            } catch (error) {
                console.error("Error refreshing access token", error);
                return {
                    ...token,
                    error: "RefreshTokenError",
                };
            }
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.user = {
                id: token.user.id,
                email: token.user.email,
                displayName: token.user.displayName,
                avatar: token.user.avatar,
                emailVerified: token.user?.emailVerified || null,
            };
            if (token.error) {
                session.error = token.error;
            }
            return session;
        },
    },
});
