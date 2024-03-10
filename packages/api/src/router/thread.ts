import * as z from "zod";

import { eq, thread } from "@genus/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const threadRouter = createTRPCRouter({
	getThreads: protectedProcedure.query(async ({ ctx }) => await ctx.db.query.thread.findMany()),
	getThreadById: protectedProcedure
		.input(
			z.object({
				id: z.number()
			})
		)
		.query(async ({ ctx, input }) => {
			return await ctx.db.query.thread.findFirst({
				where: eq(thread.id, input.id),
				with: {
					comments: {
						with: {
							author: true,
							reactions: true
						}
					}
				}
			});
		})
});
