import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            creditsRemaining: number;
        } & DefaultSession["user"];
    }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                inviteCode: { label: "Invite Code", type: "text" },
            },
            async authorize(credentials, req) {
                const dbClient = createClient(
                    process.env.SUPABASE_URL as string,
                    process.env.SUPABASE_KEY as string,
                );

                const userResponse = await dbClient
                    .from("users")
                    .select("*")
                    .eq("email", credentials?.email);

                if (userResponse.error || userResponse.data.length === 0) {
                    return null;
                }

                const user = userResponse.data[0];

                const bcrypt = require("bcrypt");

                const passwordMatch = await bcrypt.compare(
                    credentials?.password,
                    user.password,
                );

                if (!passwordMatch) return null;

                const organizationResponse = await dbClient
                    .from("organizations")
                    .select("*")
                    .eq("id", user.organization);

                if (
                    organizationResponse.error ||
                    organizationResponse.data.length === 0
                ) {
                    return null;
                }

                const organization = organizationResponse.data[0];

                return {
                    id: user.id,
                    email: user.email,
                    creditsRemaining: organization.creditsRemaining,
                };
            },
        }),
    ],
    callbacks: {
        jwt: async ({ user, token, trigger, session }) => {
            if (trigger === "update") {
                return { ...token, ...session.user };
            }
            return { ...token, ...user };
        },
        session: ({ session, token }) => {
            if (session.user) {
                session.user.id = token.id as number;
                session.user.creditsRemaining =
                    token.creditsRemaining as number;
            }
            return session;
        },
    },
};
