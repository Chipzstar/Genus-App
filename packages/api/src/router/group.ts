import { z } from "zod";
import {protectedProcedure, publicProcedure, router} from "../trpc";

/*export const groupRouter = router({
    all: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.group.findMany();
    }),
    byId: publicProcedure.input(z.number()).query(({ ctx, input }) => {
        return ctx.prisma.group.findFirst({ where: { id: input } });
    }),
    create: protectedProcedure
        .input(
            z.object({

            }))
        .mutation(({ ctx, input }) => {
            return ctx.prisma.post.create({ data: input });
        }),
});*/
