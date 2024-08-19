import { TRPCError } from "@trpc/server";

import { businessToUser, eq, user } from "@genus/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const businessRouter = createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		try {
			return (await ctx.db.query.business.findMany()) ?? [];
		} catch (err) {
			console.error(err);
			return [];
		}
	}),
	getMembers: protectedProcedure.query(async ({ ctx }) => {
		try {
			const dbUser = await ctx.db.query.user.findFirst({ where: eq(user.clerkId, ctx.auth.userId) });
			if (!dbUser) {
				throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
			}
			return await ctx.db.query.businessToUser.findMany({
				where: eq(businessToUser.userId, dbUser.id),
				with: {
					user: true
				}
			});
		} catch (err) {
			console.error(err);
			return [];
		}
	})
});
