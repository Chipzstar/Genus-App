import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const companyRouter = createTRPCRouter({
	getCompanies: publicProcedure.query(async ({ ctx }) => {
		try {
			return await ctx.db.query.company.findMany({});
		} catch (err) {
			console.error(err);
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" });
		}
	})
});
