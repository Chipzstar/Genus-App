import {createTRPCRouter} from "../trpc";
import {userRouter} from "./user";
import {authRouter} from "./auth";
import {groupRouter} from "./group";
import {messageRouter} from "./message";
import {threadRouter} from "./thread";
import {commentRouter} from "./comment";
import {reactionRouter} from "./reaction";

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
