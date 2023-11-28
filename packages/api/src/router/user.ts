import {router, publicProcedure, protectedProcedure} from "../trpc";
import {z} from "zod";

export const userRouter = router({
    byId: publicProcedure.input(z.number()).query(({ctx, input}) => {
        return ctx.prisma.user.findFirst({where: {id: input}});
    }),
    create: protectedProcedure
        .input(z.object({
            id: z.number(),
            email: z.string(),
            firstname: z.string(),
            lastname: z.string()
        }))
        .mutation(({ctx, input}) => {
            return ctx.prisma.user.create({data: input});
        }),
});
