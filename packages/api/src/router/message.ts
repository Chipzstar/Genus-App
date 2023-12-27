import { z } from "zod";
import {createTRPCRouter, protectedProcedure} from "../trpc";
import { nanoid } from 'nanoid'
import { TRPCError } from "@trpc/server";
import dayjs from 'dayjs';

export const messageRouter = createTRPCRouter({
    createMessage: protectedProcedure.input(z.object({
        groupId: z.string(),
        content: z.string(),
    })).mutation(async ({ctx, input}) => {
        try {
            let messageId = `message_${nanoid(18)}` //=> "V1StGXR8_Z5jdHi6B-myT"
            const message =  await ctx.prisma.message.create({
                data: {
                    authorId: ctx.auth.userId,
                    content: input.content,
                    groupId: input.groupId,
                    messageId,
                }
            });
            console.log(message);
             await ctx.redis.zadd(
                message.messageId,
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
    })
})
