import { TRPCError } from "@trpc/server";

import { company, inArray } from "@genus/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const companyRouter = createTRPCRouter({
	getCompanies: publicProcedure.query(async ({ ctx }) => {
		try {
			const companyWithReviews = await ctx.db.query.company.findMany({
				where: inArray(company.slug, ["barclays", "jp_morgan", "goldman_sachs", "bank_of_england", "hsbc"]),
				with: {
					reviews: true
				}
			});
			console.log(companyWithReviews);
			return companyWithReviews;
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" });
		}
	})
});
