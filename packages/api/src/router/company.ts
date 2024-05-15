import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { and, company, eq, isNotNull } from "@genus/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const companyRouter = createTRPCRouter({
	getReviewCompanies: publicProcedure.query(async ({ ctx }) => {
		try {
			const companyWithReviews = await ctx.db.query.company.findMany({
				// where: inArray(company.slug, ["barclays", "jp_morgan", "goldman_sachs", "bank_of_england", "hsbc"]),
				where: isNotNull(company.logoUrl),
				with: {
					reviews: true
				}
			});
			return companyWithReviews;
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" });
		}
	}),
	getCompanyBySlug: protectedProcedure
		.input(
			z.object({
				slug: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			try {
				const companyWithReviews = await ctx.db.query.company.findFirst({
					where: eq(company.slug, input.slug),
					with: {
						reviews: true
					}
				});
				return companyWithReviews;
			} catch (err) {
				console.error(err);
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" });
			}
		})
});
