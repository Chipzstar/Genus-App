import { createTRPCRouter } from "../trpc";
import { authRouter } from "./auth";
import { businessRouter } from "./business";
import { commentRouter } from "./comment";
import { companyRouter } from "./company";
import { groupRouter } from "./group";
import { messageRouter } from "./message";
import { reactionRouter } from "./reaction";
import { reviewRouter } from "./review";
import { threadRouter } from "./thread";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
	user: userRouter,
	auth: authRouter,
	group: groupRouter,
	message: messageRouter,
	thread: threadRouter,
	comment: commentRouter,
	reaction: reactionRouter,
	company: companyRouter,
	review: reviewRouter,
	business: businessRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
