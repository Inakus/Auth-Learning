import * as trpc from "@trpc/server"
import { hash } from "argon2"

import { Context } from "../context"
import { signUpSchema } from "../../common/validation/auth"

export const userRouter = trpc.router<Context>().mutation("signup", {
    input: signUpSchema,
    resolve: async ({ input, ctx }) => {
        const { userName, email, password } = input;

        const exists = await ctx.prisma.user.findFirst({
            where: { email },
        })

        if (exists) {
            throw new trpc.TRPCError({
                code: "CONFLICT",
                message: "User already exists",
            })
        }

        const hashedPassword = await hash(password);

        const result = await ctx.prisma.user.create({
            data: { email, userName, password: hashedPassword }
        })

        return {
            status: 201,
            message: "Account created successfully",
            result: result.email
        }
    }
})

export type AuthRouter = typeof userRouter