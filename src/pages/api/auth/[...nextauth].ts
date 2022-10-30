import NextAuth from "next-auth/next";

import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verify } from "argon2";

import { prisma } from "../../../common/prisma";
import { loginSchema } from "../../../common/validation/auth";

export const nextAuthOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Type Email Here"
                },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials, request) => {
                const creds = await loginSchema.parseAsync(credentials);

                const user = await prisma.user.findFirst({
                    where: { email: creds.email },
                })

                if (!user) {
                    return null
                }

                const isValidPassword = await verify(user.password, creds.password)

                if (!isValidPassword) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    userName: user.userName
                }
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id
                token.email = user.email
            }

            return token
        },
        session: async ({ session, token }) => {
            if (token) {
                // @ts-ignore
                session.id = token.id
            }

            return session
        },
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        maxAge: 15 * 24 * 30 * 60,
    },
    pages: {
        signIn: "/",
        newUser: "/sign-up",
    }
}

export default NextAuth(nextAuthOptions);