import fs from "fs/promises";
import path from "path";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { careerInterestToUser, companyToUser, eq, user, type careerInterest } from "@genus/db";
import { signupStep2Schema, signupStep3Schema } from "@genus/validators";
import { CAREER_INTERESTS, companies } from "@genus/validators/constants";
import { checkProfileType, encryptString } from "@genus/validators/helpers";

import { createTRPCRouter, publicProcedure } from "../trpc";

type CareerInterestSlug = typeof careerInterest.$inferSelect.slug;

export const authRouter = createTRPCRouter({
	getUniversities: publicProcedure.query(async () => {
		try {
			let file = await path.join(process.cwd(), "assets", "universities.txt");
			console.log("File path:", file);
			let data = await fs.readFile(file, "utf-8");
			// Remove the newline character from each line
			// Now 'lines' is an array containing each line in the file
			return data.split("\n").map(line => line.trim());
		} catch (err) {
			console.error(err);
			// @ts-ignore
			return [];
		}
	}),
	checkEmailExists: publicProcedure
		.input(
			z.object({
				email: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				return ctx.db.query.user.findFirst({
					where: eq(user.email, input.email)
				});
			} catch (e: any) {
				console.log(e);
				throw new TRPCError({ code: "BAD_REQUEST", message: e.message });
			}
		}),
	checkOnboardingStatus: publicProcedure
		.input(
			z.object({
				email: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const dbUser = await ctx.db.query.user.findFirst({
					where: eq(user.email, input.email)
				});
				if (dbUser) {
					return dbUser.onboardingStatus;
				}
				return "completed";
			} catch (err: any) {
				console.error(err);
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
			}
		}),
	addTempPassword: publicProcedure
		.input(
			z.object({
				email: z.string(),
				password: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const dbUser = await ctx.db.query.user.findFirst({
					where: eq(user.email, input.email)
				});
				if (dbUser) {
					const encPassword = encryptString(input.password, process.env.AXIOM_TOKEN!);
					await ctx.db
						.update(user)
						.set({
							tempPassword: encPassword
						})
						.where(eq(user.email, input.email))
						.returning();
					return dbUser;
				}
				return null;
			} catch (err: any) {
				console.error(err);
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
			}
		}),
	updateUserStep2: publicProcedure
		.input(
			signupStep2Schema.extend({
				email: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				return await ctx.db
					.update(user)
					.set({
						gender: input.gender,
						ethnicity: input.ethnicity,
						university: input.university,
						broadDegreeCourse: input.broad_degree_course,
						degreeName: input.degree_name,
						currentYear: input.current_year,
						completionYear: Number(input.completion_year),
						profileType: checkProfileType(input.current_year),
						onboardingStatus: "career_info"
					})
					.where(eq(user.email, input.email));
			} catch (e: any) {
				console.log(e);
				throw new TRPCError({ code: "BAD_REQUEST", message: e.message });
			}
		}),
	updateUserStep3: publicProcedure
		.input(
			signupStep3Schema.extend({
				email: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const dbUser = (await ctx.db.select().from(user).where(eq(user.email, input.email)))[0];

				if (!dbUser) throw new TRPCError({ code: "NOT_FOUND", message: "No user found with that email" });

				// insert the new career interests
				const careerInterestQueries = input.career_interests.map(slug => {
					return {
						careerInterestId: CAREER_INTERESTS[slug],
						userId: dbUser.id
					};
				});
				await ctx.db.insert(careerInterestToUser).values(careerInterestQueries);

				// insert the new companies
				const companyQueries = input.company_interests.map(company => {
					const companyId = companies.indexOf(company) + 1; // + 1 to account array indexing starting at 0
					console.log({ companyId });
					return {
						companyId,
						userId: dbUser.id
					};
				});
				await ctx.db.insert(companyToUser).values(companyQueries);

				const updatedUser = await ctx.db
					.update(user)
					.set({
						experienceType: input.experience_type,
						onboardingStatus: "completed"
					})
					.where(eq(user.email, input.email))
					.returning();
				if (!updatedUser[0])
					throw new TRPCError({ code: "NOT_FOUND", message: "No user found with that email" });
				return updatedUser[0];
			} catch (e: any) {
				console.log(e);
				throw new TRPCError({ code: "BAD_REQUEST", message: e.message });
			}
		})
});
