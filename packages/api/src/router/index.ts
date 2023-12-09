import { createTRPCRouter } from "../trpc";
import { userRouter } from "./user";
import { authRouter } from "./auth";

export const appRouter = createTRPCRouter({
  user: userRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
