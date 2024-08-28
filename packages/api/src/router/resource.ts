import { TRPCError } from "@trpc/server";

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
	})
});
