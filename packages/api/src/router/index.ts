import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { commentRouter } from "./comment";
import { groupRouter } from "./group";
import { messageRouter } from "./message";
import { reactionRouter } from "./reaction";
import { threadRouter } from "./thread";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
	user: userRouter,
	auth: authRouter,
	group: groupRouter,
	message: messageRouter,
	thread: threadRouter,
	comment: commentRouter,
	reaction: reactionRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
