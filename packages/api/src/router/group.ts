import * as z from "zod";
import {createTRPCRouter, protectedProcedure} from "../trpc";
import {TRPCError} from "@trpc/server";
import { log } from 'next-axiom';
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
                return await ctx.prisma.group.findUnique({
                    where: {
                        slug: input.slug,
                    },
                    include: {
                        messages: {
                            include: {
                                author: {
                                    select: {
                                        firstname: true,
                                        lastname: true,
                                        email: true,
                                    }
                                }
                            },
                            orderBy: {
                                createdAt: 'desc',
                            },
                        }
                    },
                });
            } catch (err: any) {
                log.error("Something went wrong!", err)
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
