import fs from "fs/promises";
import path from "path";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
	getSecretMessage: protectedProcedure.query(() => {
		return "you can see this secret message!";
	}),
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
				const user = await ctx.accelerateDB.user.findFirst({
					where: { email: input.email },
					cacheStrategy: {
						ttl: 60,
						swr: 60
					}
				});
				console.log(user);
				return user;
			} catch (e: any) {
				console.log(e);
				throw new TRPCError({ code: "BAD_REQUEST", message: e.message });
			}
		})
});
