import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { z } from "zod";

import { and, business, businessToUser, eq, ne, user } from "@genus/db";
import { CreateBusinessSchema } from "@genus/validators";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const businessRouter = createTRPCRouter({
	all: protectedProcedure.query(async ({ ctx }) => {
		try {
			return (
				(await ctx.db.query.business.findMany({
					where: eq(business.isPublic, true)
				})) ?? []
			);
		} catch (err) {
			console.error(err);
			return [];
		}
	}),
	byOwner: protectedProcedure.input(z.object({ userId: z.string() }).optional()).query(async ({ ctx, input }) => {
		try {
			const userId = input ? input.userId : ctx.auth.userId;
			return await ctx.db.query.business.findMany({
				where: eq(business.ownerId, userId)
			});
		} catch (err) {
			console.error(err);
			return [];
		}
	}),
	members: protectedProcedure.query(async ({ ctx }) => {
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
			const other = input.other?.split(",") ?? [];
			const dbBusiness = await ctx.db
				.insert(business)
				.values({
					businessId: `business_${nanoid(18)}`,
					ownerId: ctx.auth.userId,
					name: input.title,
					slug: slugify(input.title, { lower: true }),
					description: input.description,
					tags: input.tags,
					logoUrl: input.logoUrl,
					url: input.url,
					tiktok: input?.tiktok,
					instagram: input?.instagram,
					linkedIn: input?.linkedIn,
					socialHandles: [input.linkedIn, input.tiktok, input.instagram, ...other],
					admins: input.admins.slice(1) ?? []
				})
				.returning();

			if (!dbBusiness[0]) {
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create business" });
			}
			await ctx.db.insert(businessToUser).values({
				businessId: dbBusiness[0].id,
				userId: dbUser.id
			});
			console.log(dbBusiness);
			return dbBusiness;
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
		}
	}),
	getBusinessBySlug: protectedProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
		try {
			const dbBusiness = await ctx.db.query.business.findFirst({
				where: eq(business.slug, input.slug),
				with: {
					owner: true
				}
			});
			if (!dbBusiness) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Business not found" });
			}
			return dbBusiness;
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
		}
	}),
	getBusinessesByOwner: protectedProcedure
		.input(z.object({ ownerId: z.string(), ignoreSlug: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const dbBusinesses = ctx.db.query.business.findMany({
					where: and(eq(business.ownerId, input.ownerId), ne(business.slug, input.ignoreSlug))
				});
				console.log(dbBusinesses);
				return dbBusinesses;
			} catch (err) {
				console.error(err);
			}
		}),
	updateBusinessVisibility: protectedProcedure
		.input(z.object({ slug: z.string() }))
		.mutation(async ({ ctx, input }) => {
			try {
				const dbBusiness = await ctx.db.query.business.findFirst({ where: eq(business.slug, input.slug) });
				if (!dbBusiness) {
					throw new TRPCError({ code: "NOT_FOUND", message: "Business not found" });
				}
				const res = await ctx.db
					.update(business)
					.set({ isPublic: !dbBusiness.isPublic })
					.where(eq(business.slug, input.slug))
					.returning();
				console.log(res);
				if (!res || !res[0]) {
					throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update visibility" });
				}
				return res[0];
			} catch (err) {
				console.error(err);
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
			}
		})
});
