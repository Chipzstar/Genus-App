import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { log } from "next-axiom";
import { z } from "zod";

import { formatString } from "@genus/validators/helpers";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const messageRouter = createTRPCRouter({
	createMessage: protectedProcedure
		.input(
			z.object({
				groupId: z.string(),
				content: z.string(),
				type: z.enum(["NORMAL", "EVENT", "ANNOUNCEMENT"]).default("NORMAL")
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				let messageId = `message_${nanoid(18)}`; //=> "V1StGXR8_Z5jdHi6B-myT"
				const message = await ctx.accelerateDB.message.create({
					data: {
						authorId: ctx.auth.userId,
						content: input.content,
						groupId: input.groupId,
						messageId
					},
					include: {
						group: {
							select: {
								slug: true
							}
						},
						author: {
							select: {
								firstname: true,
								lastname: true
							}
						}
					}
				});

				const recipients = await ctx.accelerateDB.groupUser.findMany({
					where: {
						groupId: input.groupId,
						userId: {
							not: ctx.auth.userId
						}
					},
					select: {
						userId: true,
						user: {
							select: {
								email: true
							}
						}
					}
				});
				const notification = await ctx.magicbell.store.create({
					title: `Message from ${message.author.firstname} ${message.author.lastname}`,
					content: input.content,
					recipients: recipients.map(r => ({ email: r.user.email, external_id: r.userId })),
					topic: message.messageId,
					category: formatString(message.group.slug),
					action_url: `/${message.group.slug}?messageId=${message.messageId}`
				});
				console.log(notification);
				log.info("-----------------------------------------------");
				log.debug("New user!!", notification);
				log.info("-----------------------------------------------");

				/*await ctx.redis.zadd(`${input.groupId}--${message.messageId}`, {
				score: dayjs(message.createdAt).valueOf(),
				member: JSON.stringify(message)
			});*/
				return message;
			} catch (err) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Something went wrong!",
					cause: err
				});
			}
		}),
	getMessages: protectedProcedure
		.input(
			z.object({
				groupId: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			try {
				const messages = await ctx.accelerateDB.message.findMany({
					where: {
						groupId: input.groupId
					},
					orderBy: {
						createdAt: "desc"
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
				return messages;
			} catch (err: any) {
				log.error("Something went wrong!", err);
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Something went wrong!",
					cause: err
				});
			}
		})
});
