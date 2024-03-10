import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { careerInterest, careerInterestToUser, eq, inArray, user } from "@genus/db";
import {
	broadCourseCategorySchema,
	careerInterestsSchema,
	completionYearSchema,
	ethnicitiesSchema,
	gendersSchema,
	universitiesSchema
} from "@genus/validators";
import { career_interests } from "@genus/validators/constants";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	getById: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
		// return ctx.accelerateDB.user.findFirst({ where: { id: input } });
		return ctx.db.query.user.findFirst({ where: eq(user.id, input) });
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
				completionYear: user.completionYear
			};
			const dbUser = await ctx.db.query.user.findFirst({
				where: eq(user.clerkId, ctx.auth.userId),
				with: {
					careerInterests: true
				}
			});
			console.log(dbUser);
			ctx.logger.info("-----------------------------------------");
			ctx.logger.debug("User", dbUser);
			ctx.logger.info("-----------------------------------------");
			return dbUser;
		} catch (err: any) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.body.message });
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
				const user = await ctx.accelerateDB.user.update({
					where: { clerkId: ctx.auth.userId },
					data: {
						firstname: input.firstname,
						lastname: input.lastname,
						university: input.university,
						broadDegreeCourse: input.broad_degree_course,
						degreeName: input.degree_name,
						completionYear: Number(input.completion_year)
					},
					include: {
						careerInterests: true
					}
				});
				const activeSlugs = user.careerInterests.map(i => i.slug);
				// add the user to the relevant career interest record
				await Promise.all(
					career_interests.map(slug => {
						if (!activeSlugs.includes(slug) && input.career_interests.includes(slug)) {
							ctx.accelerateDB.careerInterest
								.update({
									where: {
										slug
									},
									data: {
										users: {
											connect: { id: user.id }
										}
									},
									include: {
										users: true
									}
								})
								.then(result => console.log(`${slug} assigned to user ${user.clerkId}`));
						} else if (activeSlugs.includes(slug) && !input.career_interests.includes(slug)) {
							ctx.accelerateDB.careerInterest
								.update({
									where: { slug },
									data: {
										users: {
											disconnect: { id: user.id }
										}
									},
									include: {
										users: true
									}
								})
								.then(result =>
									console.log(
										`${slug} unassigned from user ${user.clerkId}\n${JSON.stringify(result, null, 2)}`
									)
								);
						}
					})
				);
				return user;
			} catch (e: any) {
				console.log(e);
				throw new TRPCError({ code: "BAD_REQUEST", message: e.message });
			}
		})
});
