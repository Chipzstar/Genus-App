import * as z from "zod";
import {createTRPCRouter, protectedProcedure} from "../trpc";
import {nanoid} from 'nanoid'
import { TRPCError } from "@trpc/server";

const createCommentSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("thread"),
        messageContent: z.string(),
        content: z.string(),
        messageId: z.number(),
        authorId: z.string(),
    }),
    z.object({
        type: z.literal("comment"),
        threadId: z.string(),
        content: z.string(),
        messageId: z.number(),
        authorId: z.string(),
    })
])
export const commentRouter = createTRPCRouter({
    createComment: protectedProcedure.input(createCommentSchema).mutation(async ({ctx, input}) => {
        try {
            let result;
            let commentId = `comment_${nanoid(18)}` //=> "V1StGXR8_Z5jdHi6B-myT"
            if (input.type === "thread") {
                let result = await ctx.prisma.thread.create({
                    data: {
                        comments: {
                            create: {
                                commentId,
                                authorId: ctx.auth.userId,
                                content: input.messageContent,
                            }
                        },
                        threadId: `thread_${nanoid(18)}`,
                        messageId: input.messageId,
                        authorId: input.authorId,
                        content: input.content
                    }
                });
            } else {
                let result = await ctx.prisma.comment.create({
                    data: {
                        authorId: ctx.auth.userId,
                        content: input.content,
                        threadId: input.threadId,
                        commentId
                    }
                });
            }
            console.log(result);
            /*await ctx.redis.zadd(
                `${input.threadId}--${comment.commentId}`,
                {
                    score: dayjs(comment.createdAt).valueOf(),
                    member: JSON.stringify(comment)
                }
            );*/
            return result;
        } catch (err) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Something went wrong!",
                cause: err,
            })
        }
    }),
})
