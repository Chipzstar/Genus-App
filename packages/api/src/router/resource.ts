import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";

import { eq, resource } from "@genus/db";
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
	getResourceById: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		try {
			const dbResource = await ctx.db.query.resource.findFirst({
				where: eq(resource.resourceId, input),
				with: {
					author: true
				}
			});
			if (!dbResource) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Resource not found" });
			}
			return dbResource;
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
