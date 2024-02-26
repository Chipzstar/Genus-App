import * as z from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const threadRouter = createTRPCRouter({
	getThreads: protectedProcedure.query(async ({ ctx }) => await ctx.accelerateDB.thread.findMany()),
	getThreadById: protectedProcedure
		.input(
			z.object({
				id: z.number()
			})
		)
		.query(async ({ ctx, input }) => {
			return ctx.accelerateDB.thread.findUniqueOrThrow({
				where: {
					id: input.id
				},
				include: {
					comments: {
						include: {
							author: true,
							reactions: true
						}
					}
				}
			});
		})
});
