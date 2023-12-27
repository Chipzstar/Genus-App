import * as z from "zod";
import {protectedProcedure, publicProcedure, createTRPCRouter} from "../trpc";
import {TRPCError} from "@trpc/server";

export const groupRouter = createTRPCRouter({
    getGroups: protectedProcedure.query(async ({ctx}) => await ctx.prisma.group.findMany()),
    getGroupById: protectedProcedure.input(z.object({
        id: z.number()
    })).query(async ({ctx, input}) => {
        return ctx.prisma.group.findFirst({where: {id: input.id}});
    }),
    getGroupBySlug: protectedProcedure
        .input(z.object({
            slug: z.string()
        }))
        .query(async ({ctx, input}) => {
            try {
                const group = await ctx.prisma.group.findUnique({
                    where: {
                        slug: input.slug,
                    },
                    include: {
                        messages: {
                            orderBy: {
                                createdAt: 'desc',
                            },
                        }
                    },
                });
                return group;
            } catch (err) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Group not found!",
                    cause: err,
                });
            }
        })
    /*create: protectedProcedure
        .input(
            z.object({

            }))
        .mutation(({ ctx, input }) => {
            return ctx.prisma.group.create({ data: input });
        }),*/
});
