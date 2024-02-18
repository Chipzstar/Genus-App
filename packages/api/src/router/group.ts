import { TRPCError } from "@trpc/server";
import { log } from "next-axiom";
import * as z from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const groupRouter = createTRPCRouter({
	getGroups: publicProcedure.query(async ({ ctx }) => await ctx.prisma.group.findMany()),
	getGroupById: protectedProcedure
		.input(
			z.object({
				id: z.number()
			})
		)
		.query(async ({ ctx, input }) => {
			return ctx.prisma.group.findFirst({
				where: {
					id: input.id
				}
			});
		}),
	getGroupBySlug: protectedProcedure
		.input(
			z.object({
				slug: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			try {
				const group = await ctx.accelerateDB.group.findUniqueOrThrow({
					where: {
						slug: input.slug
					},
					include: {
						members: {
							select: {
								userId: true,
								user: {
									select: {
										firstname: true,
										lastname: true,
										imageUrl: true
									}
								},
								role: true
							}
						}
					},
					cacheStrategy: {
						ttl: 60,
						swr: 60
					}
				});
				const messages = await ctx.accelerateDB.message.findMany({
					where: {
						groupId: group.groupId
					},
					orderBy: {
						createdAt: "desc"
					},
					include: {
						author: {
							select: {
								firstname: true,
								lastname: true,
								imageUrl: true
							}
						},
						reactions: true,
						thread: true
					}
				});
				return {
					group,
					messages
				};
			} catch (err: any) {
				log.error("Something went wrong!", err);
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Group not found!",
					cause: err
				});
			}
		}),
	joinGroup: protectedProcedure
		.input(
			z.object({
				slug: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				// lookup up the user using the clerk userId
				const user = await ctx.accelerateDB.user.findUniqueOrThrow({
					where: {
						clerkId: ctx.auth.userId
					},
					cacheStrategy: {
						ttl: 60,
						swr: 60
					}
				});
				return await ctx.accelerateDB.group.update({
					where: {
						slug: input.slug
					},
					data: {
						members: {
							create: {
								role: "MEMBER",
								userId: ctx.auth.userId,
								firstname: user.firstname,
								lastname: user.lastname,
								imageUrl: user.imageUrl ?? undefined
							}
						}
					}
				});
			} catch (err: any) {
				log.error("Something went wrong!", err);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Oops, something went wrong!",
					cause: err
				});
			}
		})
});
