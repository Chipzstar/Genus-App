import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import * as z from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

function timeout(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const createCommentSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("thread"),
		messageContent: z.string(),
		content: z.string(),
		messageId: z.number(),
		authorId: z.string(),
		groupId: z.string()
	}),
	z.object({
		type: z.literal("comment"),
		threadId: z.string(),
		content: z.string(),
		messageId: z.number(),
		authorId: z.string(),
		groupId: z.string()
	})
]);
export const commentRouter = createTRPCRouter({
	createComment: protectedProcedure.input(createCommentSchema).mutation(async ({ ctx, input }) => {
		try {
			let commentId = `comment_${nanoid(18)}`; //=> "V1StGXR8_Z5jdHi6B-myT"
			const user = await ctx.accelerateDB.user.findUniqueOrThrow({
				where: {
					clerkId: ctx.auth.userId
				},
				select: {
					firstname: true,
					lastname: true
				},
				cacheStrategy: {
					ttl: 60 * 60 * 24,
					swr: 60
				}
			});
			const author = `${user.firstname} ${user.lastname}`;
			if (input.type === "thread") {
				const thread = await ctx.accelerateDB.thread.create({
					data: {
						comments: {
							create: {
								commentId,
								authorId: ctx.auth.userId,
								content: input.content,
								groupId: input.groupId
							}
						},
						threadId: `thread_${nanoid(18)}`,
						messageId: input.messageId,
						authorId: input.authorId,
						content: input.messageContent,
						groupId: input.groupId
					},
					select: {
						messageId: true,
						threadId: true,
						group: {
							select: {
								slug: true
							}
						},
						author: {
							select: {
								email: true
							}
						}
					}
				});
				ctx.posthog.capture({
					distinctId: ctx.auth.userId,
					event: 'group_thread_created',
					properties: {
						threadId: thread.threadId,
						groupId: input.groupId,
						messageId: input.messageId,
						content: input.content
					}
				})
				if (ctx.auth.userId !== input.authorId) {
					const notification = await ctx.magicbell.store.create({
						title: `Comment from ${author}`,
						content: input.content,
						recipients: [{ external_id: input.authorId }],
						topic: thread.group.slug,
						category: "comment",
						action_url: `/${thread.group.slug}?messageId=${thread.messageId}&commentId=${commentId}`
					});
					ctx.logger.info("-----------------------------------------------");
					ctx.logger.debug("New notification!!", notification);
					ctx.logger.info("-----------------------------------------------");
				}
				return thread;
			}

			const comment = await ctx.accelerateDB.comment.create({
				data: {
					authorId: ctx.auth.userId,
					content: input.content,
					threadId: input.threadId,
					groupId: input.groupId,
					commentId
				},
				include: {
					thread: {
						select: {
							messageId: true
						}
					},
					group: {
						select: {
							slug: true
						}
					}
				}
			});
			ctx.posthog.capture({
				distinctId: ctx.auth.userId,
                event: 'group_comment_created',
                properties: {
                    commentId,
                    groupId: input.groupId,
                    messageId: input.messageId,
                    content: input.content
                }
			})
			const recipients = await ctx.accelerateDB.comment.findMany({
				where: {
					threadId: input.threadId,
					authorId: {
						not: ctx.auth.userId
					}
				},
				orderBy: {
					createdAt: "desc"
				},
				select: {
					authorId: true
				}
			});
			const notification = await ctx.magicbell.store.create({
				title: `Comment from ${author}`,
				content: input.content,
				recipients: recipients.map(c => ({ external_id: c.authorId })),
				category: "comment",
				topic: comment.group.slug,
				action_url: `/${comment.group.slug}?messageId=${comment.thread.messageId}&commentId=${commentId}`
			});
			ctx.logger.info("-----------------------------------------------");
			ctx.logger.debug("New notification!!", notification);
			ctx.logger.info("------------------------------------------------");

			return comment;
		} catch (err) {
			ctx.logger.error("Something went wrong!", err);
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Something went wrong!",
				cause: err
			});
		}
	})
});
