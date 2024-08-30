import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import * as z from "zod";

import { and, db, eq, group, groupUser, message, ne, user } from "@genus/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const messageRouter = createTRPCRouter({
	createMessage: protectedProcedure
		.input(
			z.object({
				groupId: z.string(),
				content: z.string(),
				type: z.enum(["NORMAL", "EVENT", "ANNOUNCEMENT"]).default("NORMAL"),
				isAnonymous: z.boolean().default(false)
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				let messageId = `message_${nanoid(18)}`; //=> "V1StGXR8_Z5jdHi6B-myT"
				const dbMessage = (
					await ctx.db
						.insert(message)
						.values({
							authorId: ctx.auth.userId,
							content: input.content,
							groupId: input.groupId,
							messageId,
							isAnonymous: input.isAnonymous
						})
						.returning()
				)[0];

				const dbUser = await ctx.db.query.user.findFirst({
					where: eq(user.clerkId, ctx.auth.userId)
				});
				const dbGroup = await ctx.db.query.group.findFirst({
					where: eq(group.groupId, input.groupId)
				});

				if (!dbGroup) throw new TRPCError({ code: "NOT_FOUND", message: "Group not found" });
				if (!dbUser) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

				ctx.posthog.capture({
					distinctId: ctx.auth.userId,
					event: "group_message_sent",
					properties: {
						messageId,
						groupId: input.groupId,
						content: input.content
					}
				});

				const recipients = await ctx.db.query.groupUser.findMany({
					where: and(eq(groupUser.groupId, input.groupId), ne(groupUser.userId, ctx.auth.userId)),
					columns: {
						userId: true
					},
					with: {
						user: {
							columns: {
								email: true
							}
						}
					}
				});

				if (recipients.length) {
					const title = input.isAnonymous
						? `Message from anon`
						: `Message from ${dbUser.firstname} ${dbUser.lastname}`;
					/*const notification = await ctx.magicbell.store.create({
						title,
						content: input.content,
						recipients: recipients.map(r => ({ email: r.user.email, external_id: r.userId })),
						topic: dbGroup.slug,
						category: "message",
						action_url: `/${dbGroup.slug}?messageId=${messageId}`
					});*/
					/*ctx.posthog.capture({
					  distinctId: ctx.auth.userId,
					  event: 'magicbell_notification_sent',
					  properties: {
						  notificationId: notification.id,
						  recipients: recipients.map(r => ({ email: r.user.email })),
						  action_url: `/${message.group.slug}?messageId=${message.messageId}`
					  }
				  })*/
				}
				return dbMessage;
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Something went wrong!",
					cause: err
				});
			}
		})
});
