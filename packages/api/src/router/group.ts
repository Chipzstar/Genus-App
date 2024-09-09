import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { desc, eq, group, groupUser, message, user } from "@genus/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const groupRouter = createTRPCRouter({
	getGroups: publicProcedure.query(async ({ ctx }) => await ctx.db.query.group.findMany()),
	getGroupById: protectedProcedure
		.input(
			z.object({
				id: z.number()
			})
		)
		.query(async ({ ctx, input }) => {
			return ctx.db.query.group.findFirst({
				where: eq(group.id, input.id)
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
				const dbGroup = await ctx.db.query.group.findFirst({
					where: eq(group.slug, input.slug),
					with: {
						members: {
							columns: {
								userId: true,
								role: true
							},
							with: {
								user: {
									columns: {
										firstname: true,
										lastname: true,
										imageUrl: true
									}
								}
							}
						}
					}
				});

				if (!dbGroup) throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });

				const messages = await ctx.db.query.message.findMany({
					where: eq(message.groupId, dbGroup.groupId),
					orderBy: [desc(message.createdAt)],
					with: {
						author: {
							columns: {
								clerkId: true,
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
					group: dbGroup,
					messages
				};
			} catch (err: any) {
				console.error(err);
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
				const dbUser = await ctx.db.query.user.findFirst({
					where: eq(user.clerkId, ctx.auth.userId)
				});

				if (!dbUser) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

				const dbGroup = await ctx.db.query.group.findFirst({
					where: eq(group.slug, input.slug),
					with: {
						members: true
					}
				});

				if (!dbGroup) throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });

				return await ctx.db
					.insert(groupUser)
					.values({
						userId: ctx.auth.userId,
						groupId: dbGroup.groupId,
						firstname: dbUser.firstname,
						lastname: dbUser.lastname,
						imageUrl: dbUser.imageUrl ?? undefined,
						role: "MEMBER"
					})
					.returning();
			} catch (err: any) {
				console.error(err);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Oops, something went wrong!",
					cause: err
				});
			}
		})
});
