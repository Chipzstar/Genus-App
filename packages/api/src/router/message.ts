import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";

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
				ctx.posthog.capture({
					distinctId: ctx.auth.userId,
					event: 'group_message_sent',
					properties: {
						messageId,
						groupId: input.groupId,
						content: input.content
					}
				})

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
					topic: message.group.slug,
					category: "message",
					action_url: `/${message.group.slug}?messageId=${message.messageId}`
				});
				/*ctx.posthog.capture({
					distinctId: ctx.auth.userId,
					event: 'magicbell_notification_sent',
					properties: {
						notificationId: notification.id,
						recipients: recipients.map(r => ({ email: r.user.email })),
						action_url: `/${message.group.slug}?messageId=${message.messageId}`
					}
				})*/
				ctx.logger.info("-----------------------------------------------");
				ctx.logger.debug("New notification!!", notification);
				ctx.logger.info("-----------------------------------------------");
				return message;
			} catch (err) {
				ctx.logger.error("Something went wrong!", err);
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
				return await ctx.accelerateDB.message.findMany({
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
			} catch (err: any) {
				ctx.logger.info("********************************************");
				ctx.logger.error("Something went wrong!", err);
				ctx.logger.info("********************************************");
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Something went wrong!",
					cause: err
				});
			}
		})
});
