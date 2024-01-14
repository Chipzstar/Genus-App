import * as z from "zod";
import {createTRPCRouter, protectedProcedure} from "../trpc";

export const threadRouter = createTRPCRouter({
    getThreads: protectedProcedure.query(async ({ctx}) => await ctx.prisma.thread.findMany()),
    getThreadById: protectedProcedure.input(z.object({
        id: z.number()
    })).query(async ({ctx, input}) => {
        return ctx.prisma.thread.findFirstOrThrow({
            where: {
                id: input.id
            },
            include: {
                comments: {
                    include: {
                        author: true
                    }
                }
            }
        });
    })
})
