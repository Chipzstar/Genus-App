import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import * as z from "zod";

import { and, db, eq, hobbyInterest, hobbyInterestToUser, inArray, user } from "@genus/db";
import { signupStep2Schema, signupStep3Schema } from "@genus/validators";
import { encryptString } from "@genus/validators/helpers";

import { createTRPCRouter, publicProcedure } from "../trpc";

type InsertHobbyInterestUser = typeof hobbyInterestToUser.$inferInsert;

const getUserByEmail = db
	.select()
	.from(user)
	.where(eq(user.email, sql.placeholder("email")))
	.prepare("getUserByEmail");

export const authRouter = createTRPCRouter({
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
				// const dbUser = await ctx.db.query.user.findFirst({
				// 	where: eq(user.email, input.email)
				// });
				const dbUser = await getUserByEmail.execute({ email: input.email });
				if (dbUser[0]) {
					return dbUser[0].onboardingStatus;
				}
				return "completed";
			} catch (err: any) {
				console.error(err);
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
			}
		}),
	checkUserActive: publicProcedure
		.input(
			z.object({
				email: z.string().email()
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const dbUser = await ctx.db.query.user.findFirst({
					where: and(eq(user.email, input.email), eq(user.isActive, true))
				});
				return !!dbUser;
			} catch (err) {
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
						age: input.age,
						roleSector: input.role_sector,
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

				// insert the new hobbies & interests
				const dbHobbyInterests = await ctx.db.query.hobbyInterest.findMany({
					where: inArray(hobbyInterest.slug, input.hobbies_interests)
				});

				const hobbyInterestInsertQueries: InsertHobbyInterestUser[] = dbHobbyInterests.map(({ id }) => {
					return {
						hobbyInterestId: id,
						userId: dbUser.id
					};
				});
				await ctx.db.insert(hobbyInterestToUser).values(hobbyInterestInsertQueries);
				return dbUser;
			} catch (e: any) {
				console.log(e);
				throw new TRPCError({ code: "BAD_REQUEST", message: e.message });
			}
		})
});
