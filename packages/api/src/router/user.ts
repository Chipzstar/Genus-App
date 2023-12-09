import {createTRPCRouter, publicProcedure, protectedProcedure} from "../trpc";
import {z} from "zod";

export const userRouter = createTRPCRouter({
    byId: publicProcedure.input(z.number()).query(({ctx, input}) => {
        return ctx.prisma.user.findFirst({where: {id: input}});
    })
});
