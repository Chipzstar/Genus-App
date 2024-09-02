import { TRPCError } from "@trpc/server";
import * as z from "zod";

import {
	careerInterest,
	careerInterestToUser,
	db,
	eq,
	hobbyInterest,
	hobbyInterestToUser,
	inArray,
	sql,
	user
} from "@genus/db";
import {
	broadCourseCategorySchema,
	careerInterestsSchema,
	completionYearSchema,
	gendersSchema,
	profileSchema,
	universitiesSchema
} from "@genus/validators";
import { career_interests, hobbies } from "@genus/validators/constants";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	getById: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
		// return ctx.db.query.user.findFirst({ where: eq(user.id, 76) });
		return (await ctx.db.select().from(user).where(eq(user.id, input)))[0];
	}),
	getUsers: protectedProcedure.query(async ({ ctx, input }) => {
		return await ctx.db.select().from(user);
	}),
	getByClerkId: protectedProcedure.query(async ({ ctx }) => {
		try {
			const fields = {
				firstname: user.firstname,
				lastname: user.lastname,
				profileType: user.profileType,
				gender: user.gender,
				ethnicity: user.ethnicity,
				university: user.university,
				broadDegreeCourse: user.broadDegreeCourse,
				degreeName: user.degreeName,
				completionYear: user.completionYear,
				currentYear: user.currentYear,
				hobbyInterests: hobbyInterest.slug
			};
			const dbUser = await ctx.db.query.user.findFirst({
				where: eq(user.clerkId, ctx.auth.userId),
				with: {
					hobbies: {
						columns: {},
						with: {
							hobbyInterest: {
								columns: {
									slug: true
								}
							}
						}
					}
				}
			});

			if (!dbUser) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

			let hobbyInterests = dbUser.hobbies.map(({ hobbyInterest }) => hobbyInterest);

			return { ...dbUser, hobbyInterests };
		} catch (err: any) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.body.message });
		}
	}),
	getHobbyInterests: protectedProcedure.input(z.number()).query(async ({ input, ctx }) => {
		try {
			console.log({ input });
			const dbHobbyInterests = await ctx.db.query.hobbyInterestToUser.findMany({
				where: eq(hobbyInterestToUser.userId, input),
				with: {
					hobbyInterest: {
						columns: {
							name: true
						}
					}
				}
			});
			console.log(dbHobbyInterests);

			return dbHobbyInterests;
		} catch (err: any) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
		}
	}),
	updateProfile: protectedProcedure.input(profileSchema).mutation(async ({ ctx, input }) => {
		try {
			const dbUser = (
				await ctx.db
					.update(user)
					.set({
						firstname: input.firstname,
						lastname: input.lastname,
						gender: input.gender,
						age: input.age
					})
					.where(eq(user.clerkId, ctx.auth.userId))
					.returning()
			)[0];

			if (!dbUser) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

			const allSlugs = await ctx.db.query.hobbyInterest.findMany();

			const activeSlugs = (
				await ctx.db.query.hobbyInterestToUser.findMany({
					where: eq(hobbyInterestToUser.userId, dbUser.id),
					with: {
						hobbyInterest: true
					}
				})
			).map(({ hobbyInterest }) => hobbyInterest);

			// add the user to the relevant hobby interest record
			await Promise.all(
				hobbies.map(_slug => {
					let hobbyInterestId = allSlugs.find(({ slug }) => slug === _slug)!.id;
					// check if user added a new hobby interest that isn't already active
					if (!activeSlugs.some(({ slug }) => slug === _slug) && input.hobbies_interests.includes(_slug)) {
						db.insert(hobbyInterestToUser)
							.values({
								userId: dbUser.id,
								hobbyInterestId
							})
							.then(result => console.log(`${_slug} assigned to user ${dbUser.clerkId}`));
					}
					// check if user removed an existing hobby interest that was already active
					else if (
						activeSlugs.some(({ slug }) => slug === _slug) &&
						!input.hobbies_interests.includes(_slug)
					) {
						db.delete(hobbyInterestToUser)
							.where(eq(hobbyInterestToUser.hobbyInterestId, hobbyInterestId))
							.then(result => console.log(`${_slug} unassigned from user ${dbUser.clerkId}}`));
					}
				})
			);
			return dbUser;
		} catch (e: any) {
			console.log(e);
			throw new TRPCError({ code: "BAD_REQUEST", message: e.message });
		}
	})
});
