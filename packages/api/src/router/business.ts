import { createTRPCRouter, protectedProcedure } from "../trpc";

export const businessRouter = createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		try {
			return (await ctx.db.query.business.findMany()) ?? [];
		} catch (err) {
			console.error(err);
			return [];
		}
	})
});
