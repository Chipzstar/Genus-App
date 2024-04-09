import fs from "fs/promises";
import path from "path";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { eq, user } from "@genus/db";
import {
	completionYearSchema,
	currentYearSchema,
	ethnicitiesSchema,
	gendersSchema,
	signupStep2Schema
} from "@genus/validators";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
	getUniversities: publicProcedure.query(async () => {
		try {
			let file = await path.join(process.cwd(), "assets", "universities.txt");
			console.log("File path:", file);
			let data = await fs.readFile(file, "utf-8");
			let lines = data.split("\n").map(line => line.trim()); // Remove the newline character from each line
			// Now 'lines' is an array containing each line in the file
			// console.log(lines)
			// return ['University of Sussex', 'University College London', 'University of Bath'];
			return lines;
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
						onboardingStatus: "career_info"
					})
					.where(eq(user.email, input.email));
			} catch (e: any) {
				console.log(e);
				throw new TRPCError({ code: "BAD_REQUEST", message: e.message });
			}
		})
});
