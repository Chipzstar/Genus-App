import { TRPCError } from "@trpc/server";

import { Industry } from "@genus/validators";

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
			const groupedResources = new Map<Industry, Map<string, number>>([
				["banking_finance", new Map<string, number>()],
				["consulting", new Map<string, number>()],
				["law", new Map<string, number>()],
				["other", new Map<string, number>()]
			]);
			reviews.forEach(r => {
				const industryResources = groupedResources.get(r.industry)!;
				r.topResources.forEach(resource => {
					const resourceLower = resource.toLowerCase(); // Assuming case-insensitive counting
					const count = industryResources.get(resourceLower) || 0;
					industryResources.set(resourceLower, count + 1);
				});
			});

			const allResources = reviews
				.map(r => r.topResources)
				.flat()
				.map(val => val.toLowerCase());

			console.log(groupedResources);
			return { grouped: groupedResources, all: Array.from(new Set(allResources)) };
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" });
		}
	})
});
