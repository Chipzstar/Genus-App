import {createTRPCRouter} from "../trpc";
import {userRouter} from "./user";
import {authRouter} from "./auth";
import {groupRouter} from "./group";
import {messageRouter} from "./message";

export const appRouter = createTRPCRouter({
    user: userRouter,
    auth: authRouter,
    group: groupRouter,
    message: messageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
