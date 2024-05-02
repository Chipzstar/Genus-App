import type { SignedInAuthObject } from "@clerk/nextjs/api";
import { initTRPC, TRPCError } from "@trpc/server";

import { transformer } from "../transformer";
import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
	transformer,
	errorFormatter({ shape }) {
		return shape;
	}
});

const isAuthed = t.middleware(async ({ next, ctx }) => {
	if (ctx?.auth && !ctx.auth.userId) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
	}
	let auth = ctx.auth as SignedInAuthObject;
	return next({
		ctx: {
			auth
		}
	});
});

export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authed) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(isAuthed);
