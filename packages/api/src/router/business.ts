import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import slugify from "slugify";

import { business, businessToUser, eq, user } from "@genus/db";
import { CreateBusinessSchema } from "@genus/validators";

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
	}),
	createBusiness: protectedProcedure.input(CreateBusinessSchema).mutation(async ({ ctx, input }) => {
		try {
			const dbUser = await ctx.db.query.user.findFirst({ where: eq(user.clerkId, ctx.auth.userId) });
			if (!dbUser) {
				throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
			}
			console.log(input);
			const dbBusiness = await ctx.db.insert(business).values({
				businessId: `business_${nanoid(18)}`,
				name: input.title,
				slug: slugify(input.title, { lower: true }),
				description: input.description,
				tags: input.tags,
				logoUrl: input.logoUrl,
				socialHandles: [input.linkedIn, input.twitter, input.instagram, input.other]
			});
			console.log(dbBusiness);
			return dbBusiness;
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
		}
	})
});
