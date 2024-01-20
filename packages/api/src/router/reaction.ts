import * as z from "zod";
import {createTRPCRouter, protectedProcedure} from "../trpc";
import {TRPCError} from "@trpc/server";
import {nanoid} from 'nanoid';

export const reactionRouter = createTRPCRouter({
    getReaction: protectedProcedure.input(z.object({
        type: z.union([z.literal('message'), z.literal('comment')]),
        id: z.number(),
    })).query(async ({ctx, input}) => {
        try {
            let reaction = null;
            if (input.type === 'message') {
                reaction = await ctx.prisma.reaction.findFirst({
                    where: {
                        authorId: ctx.auth.userId,
                        messageId: input.id
                    }
                });
            } else {
                reaction = await ctx.prisma.reaction.findFirst({
                    where: {
                        authorId: ctx.auth.userId,
                        commentId: input.id
                    }
                });
            }
            return reaction;
        } catch (err) {
            console.error(err);
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Something went wrong!",
                cause: err,
            })
        }
    }),
    createReaction: protectedProcedure.input(z.object({
        emoji: z.string(),
        code: z.string(),
        commentId: z.number().optional(),
        messageId: z.number().optional(),
    })).mutation(async ({ctx, input}) => {
        try {
            let reactionId = `reaction_${nanoid(18)}` //=> "V1StGXR8_Z5jdHi6B-myT"
            return await ctx.prisma.reaction.create({
                data: {
                    reactionId,
                    ...(input?.commentId && {commentId: input.commentId}),
                    ...(input?.messageId && {messageId: input.messageId}),
                    authorId: ctx.auth.userId,
                    emoji: input.emoji,
                    code: input.code
                }
            })
        } catch (err) {
            console.error(err)
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Something went wrong!",
                cause: err,
            })
        }
    }),
    upsertReaction: protectedProcedure.input(z.object({
        id: z.number(),
        emoji: z.string(),
        code: z.string(),
        commentId: z.number().optional(),
        messageId: z.number().optional(),
    })).mutation(async ({ctx, input}) => {
        try {
            let reactionId = `reaction_${nanoid(18)}` //=> "V1StGXR8_Z5jdHi6B-myT"
            return await ctx.prisma.reaction.upsert({
                where: {
                    id: input.id,
                    authorId: ctx.auth.userId
                },
                update: {
                    emoji: input.emoji,
                    code: input.code
                },
                create: {
                    reactionId,
                    ...(input?.commentId && {commentId: input.commentId}),
                    ...(input?.messageId && {messageId: input.messageId}),
                    authorId: ctx.auth.userId,
                    emoji: input.emoji,
                    code: input.code
                }
            })
        } catch (err) {
            console.error(err)
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Something went wrong!",
                cause: err,
            })
        }
    }),
    deleteReaction: protectedProcedure.input(z.object({
        id: z.number(),
    })).mutation(async ({ctx, input}) => {
        try {
            return await ctx.prisma.reaction.delete({
                where: {
                    id: input.id,
                    authorId: ctx.auth.userId
                }
            })
        } catch (err) {
            console.error(err)
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Something went wrong!",
                cause: err,
            })
        }
    })
})

