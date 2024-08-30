import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

import { resource } from "@genus/db";
import { CreateResourceSchema } from "@genus/validators";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const resourceRouter = createTRPCRouter({
	getResources: protectedProcedure.query(async ({ ctx }) => {
		try {
			const resources = await ctx.db.query.resource.findMany({
				with: {
					author: true
				}
			});
			console.log(resources);
			return resources;
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" });
		}
	}),
	createResource: protectedProcedure.input(CreateResourceSchema).mutation(async ({ ctx, input }) => {
		try {
			const dbResource = await ctx.db
				.insert(resource)
				.values({
					authorId: ctx.auth.userId,
					resourceId: `resource_${nanoid(18)}`,
					name: input.title,
					description: input.description,
					url: input.url,
					tags: input.tags
				})
				.returning();

			if (!dbResource[0]) {
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create resource" });
			}
			return dbResource[0];
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" });
		}
	})
});
