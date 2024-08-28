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
	universitiesSchema
} from "@genus/validators";
import { career_interests } from "@genus/validators/constants";

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

			ctx.logger.info("-----------------------------------------");
			ctx.logger.debug("User", dbUser);
			ctx.logger.debug("Hobbies", hobbyInterests);
			ctx.logger.info("-----------------------------------------");
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

			ctx.logger.info("-----------------------------------------");
			ctx.logger.debug("HobbyInterests", dbHobbyInterests);
			ctx.logger.info("-----------------------------------------");
			return dbHobbyInterests;
		} catch (err: any) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
		}
	}),
	updateProfile: protectedProcedure
		.input(
			z.object({
				firstname: z.string(),
				lastname: z.string(),
				university: universitiesSchema,
				broad_degree_course: broadCourseCategorySchema,
				degree_name: z.string(),
				completion_year: completionYearSchema,
				career_interests: careerInterestsSchema
					.array()
					.nonempty({ message: "Please select at least one career interest" })
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const dbUser = (
					await ctx.db
						.update(user)
						.set({
							firstname: input.firstname,
							lastname: input.lastname,
							university: input.university,
							broadDegreeCourse: input.broad_degree_course,
							degreeName: input.degree_name,
							completionYear: Number(input.completion_year)
						})
						.where(eq(user.clerkId, ctx.auth.userId))
						.returning()
				)[0];

				if (!dbUser) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

				const allSlugs = await ctx.db.query.careerInterest.findMany();

				const activeSlugs = (
					await ctx.db.query.careerInterestToUser.findMany({
						where: eq(careerInterestToUser.userId, dbUser.id),
						with: {
							careerInterest: true
						}
					})
				).map(({ careerInterest }) => careerInterest);

				// add the user to the relevant career interest record
				await Promise.all(
					career_interests.map(_slug => {
						let careerInterestId = allSlugs.find(({ slug }) => slug === _slug)!.id;
						// check if user added a new career interest that isn't already active
						if (!activeSlugs.some(({ slug }) => slug === _slug) && input.career_interests.includes(_slug)) {
							db.insert(careerInterestToUser)
								.values({
									userId: dbUser.id,
									careerInterestId
								})
								.then(result => console.log(`${_slug} assigned to user ${dbUser.clerkId}`));
						}
						// check if user removed an existing career interest that was already active
						else if (
							activeSlugs.some(({ slug }) => slug === _slug) &&
							!input.career_interests.includes(_slug)
						) {
							db.delete(careerInterestToUser)
								.where(eq(careerInterestToUser.careerInterestId, careerInterestId))
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
