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
				[
					"banking_finance",
					new Map<string, number>([
						["SEO London", 4],
						["Company insight days", 1],
						["The Economist", 3],
						["Olamide Elizabeth on YouTube", 1],
						["Breaking into Wall Street", 1],
						["400 Investment Banking Question Guide", 2],
						[
							"Investment Banking: Valuation, Leveraged Buyouts and Mergers and Acquisitions by Pearl and Rosenbaum",
							1
						],
						["Options Futures and Other Derivatives by John Hull", 1],
						["Money Maze podcast", 1],
						["Market Maker podcasts", 1],
						["YouTube: Afzal Hussein", 1],
						["Sortino M&A Group", 1]
					])
				],
				[
					"consulting",
					new Map<string, number>([
						["Wall Street Oasis Guide", 1],
						["Investopedia", 1],
						["WSO Technical Guide", 1],
						["YouTube", 1]
					])
				],
				[
					"law",
					new Map<string, number>([
						["Morning Brew Daily", 1],
						["The Guardian", 2],
						["Uni societies (QMBFS)", 1],
						["Finimise: Newsletter", 1],
						["Financial Times", 4],
						["The Economist", 3]
					])
				],
				["other", new Map<string, number>([["Podcasts", 1]])]
			]);
			reviews.forEach(r => {
				const industryResources = groupedResources.get(r.industry)!;
				r.topResources.forEach(resource => {
					const resourceLower = resource.toLowerCase(); // Assuming case-insensitive counting
					const count = industryResources.get(resourceLower) || 0;
					industryResources.set(resourceLower, count + 1);
				});
			});

			const allResources: string[] = [];
			for (const key of groupedResources.keys()) {
				let subResources = groupedResources.get(key);
				if (subResources) {
					Array.from(subResources!.keys()).forEach(val => allResources.push(val.toLowerCase()));
				}
			}
			return { grouped: groupedResources, all: Array.from(new Set(allResources)) };
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" });
		}
	})
});
