import {z} from "zod";
import {createTRPCRouter, protectedProcedure} from "../trpc";
import {nanoid} from 'nanoid'
import {TRPCError} from "@trpc/server";
import dayjs from 'dayjs';
import {log} from 'next-axiom';

export const messageRouter = createTRPCRouter({
    createMessage: protectedProcedure.input(z.object({
        groupId: z.string(),
        content: z.string(),
    })).mutation(async ({ctx, input}) => {
        try {
            let messageId = `message_${nanoid(18)}` //=> "V1StGXR8_Z5jdHi6B-myT"
            const message = await ctx.prisma.message.create({
                data: {
                    authorId: ctx.auth.userId,
                    content: input.content,
                    groupId: input.groupId,
                    messageId,
                }
            });
            console.log(message);
            await ctx.redis.zadd(
                `${input.groupId}--${message.messageId}`,
                {
                    score: dayjs(message.createdAt).valueOf(),
                    member: JSON.stringify(message)
                }
            );
            return message;
        } catch (err) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Something went wrong!",
                cause: err,
            })
        }
    }),
    getMessages: protectedProcedure.input(z.object({
        groupId: z.string(),
    })).query(async ({ctx, input}) => {
        try {
            const messages = await ctx.prisma.message.findMany({
                where: {
                    groupId: input.groupId,
                },
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    author: {
                        select: {
                            firstname: true,
                            lastname: true,
                            email: true
                        }
                    }
                }
            });
            console.log(messages)
            return messages;
        } catch (err: any) {
            log.error("Something went wrong!", err)
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Something went wrong!",
                cause: err,
            })
        }
    })
})
