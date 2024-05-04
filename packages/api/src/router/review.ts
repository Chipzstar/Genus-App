import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reviewRouter = createTRPCRouter({
	getReviews: protectedProcedure.query(async ({ ctx }) => {
		try {
			return (await ctx.db.query.review.findMany()) ?? [];
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" });
		}
	}),
	getResources: protectedProcedure.query(async ({ ctx }) => {
		try {
			const reviews = await ctx.db.query.review.findMany();
			const allReviewResources = reviews.map(r => r.topResources).flat();
			const uniqueResources = new Set(allReviewResources.map(r => r.toLowerCase()));
			return Array.from(uniqueResources);
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" });
		}
	})
});
