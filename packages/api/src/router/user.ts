import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
		return ctx.prisma.user.findFirst({ where: { id: input } });
	}),
	getByClerkId: protectedProcedure.query(async ({ ctx }) => {
		const user = await ctx.prisma.user.findFirst({
			where: { clerkId: ctx.auth.userId },
			include: {
				careerInterests: {
					select: {
						slug: true
					}
				}
			}
		});
		console.log(user);
		return user;
	})
});
