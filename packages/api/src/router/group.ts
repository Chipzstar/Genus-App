import { z } from "zod";
import {protectedProcedure, publicProcedure, createTRPCRouter} from "../trpc";

export const groupRouter = createTRPCRouter({
    all: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.group.findMany();
    }),
    byId: publicProcedure.input(z.number()).query(({ ctx, input }) => {
        return ctx.prisma.group.findFirst({ where: { id: input } });
    }),
    /*create: protectedProcedure
        .input(
            z.object({

            }))
        .mutation(({ ctx, input }) => {
            return ctx.prisma.group.create({ data: input });
        }),*/
});
