import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import * as z from "zod";

import { and, comment, desc, eq, ne, thread, user } from "@genus/db";

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
		groupId: z.string(),
		isAnonymous: z.boolean().default(false)
	}),
	z.object({
		type: z.literal("comment"),
		threadId: z.string(),
		content: z.string(),
		messageId: z.number(),
		authorId: z.string(),
		groupId: z.string(),
		isAnonymous: z.boolean().default(false)
	})
]);
export const commentRouter = createTRPCRouter({
	createComment: protectedProcedure.input(createCommentSchema).mutation(async ({ ctx, input }) => {
		try {
			let commentId = `comment_${nanoid(18)}`; //=> "V1StGXR8_Z5jdHi6B-myT"
			const dbUser = await ctx.db.query.user.findFirst({
				where: eq(user.clerkId, ctx.auth.userId),
				columns: {
					firstname: true,
					lastname: true
				}
			});

			if (!dbUser) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

			const author = `${dbUser.firstname} ${dbUser.lastname}`;
			if (input.type === "thread") {
				const threadId = `thread_${nanoid(18)}`;
				await ctx.db
					.insert(thread)
					.values({
						threadId,
						messageId: input.messageId,
						authorId: input.authorId,
						content: input.messageContent,
						groupId: input.groupId
					})
					.returning();

				const dbComment = (
					await ctx.db
						.insert(comment)
						.values({
							threadId,
							commentId,
							authorId: ctx.auth.userId,
							content: input.content,
							groupId: input.groupId,
							isAnonymous: input.isAnonymous
						})
						.returning()
				)[0];

				const dbThread = await ctx.db.query.thread.findFirst({
					where: eq(thread.threadId, threadId),
					with: {
						group: {
							columns: {
								slug: true
							}
						},
						author: {
							columns: {
								email: true
							}
						}
					}
				});

				if (!dbThread) throw new TRPCError({ code: "NOT_FOUND", message: "Thread not found" });

				ctx.posthog.capture({
					distinctId: ctx.auth.userId,
					event: "group_thread_created",
					properties: {
						threadId: thread.threadId,
						groupId: input.groupId,
						messageId: input.messageId,
						content: input.content
					}
				});
				if (ctx.auth.userId !== input.authorId) {
					const title = input.isAnonymous ? "Comment from anon" : `Comment from ${author}`;
					/*const notification = await ctx.magicbell.store.create({
						title,
						content: input.content,
						recipients: [{ external_id: input.authorId }],
						topic: dbThread.group.slug,
						category: "comment",
						action_url: `/${dbThread.group.slug}?messageId=${dbThread.messageId}&commentId=${commentId}`
					});*/
				}
				return dbThread;
			}

			// IF THE TYPE IS A COMMENT
			await ctx.db.insert(comment).values({
				authorId: ctx.auth.userId,
				content: input.content,
				threadId: input.threadId,
				groupId: input.groupId,
				commentId,
				isAnonymous: input.isAnonymous
			});

			const dbComment = await ctx.db.query.comment.findFirst({
				where: eq(comment.commentId, commentId),
				with: {
					thread: {
						columns: {
							messageId: true
						}
					},
					group: {
						columns: {
							slug: true
						}
					}
				}
			});

			if (!dbComment) throw new TRPCError({ code: "NOT_FOUND", message: "Comment not found" });

			ctx.posthog.capture({
				distinctId: ctx.auth.userId,
				event: "group_comment_created",
				properties: {
					commentId,
					groupId: input.groupId,
					messageId: input.messageId,
					content: input.content
				}
			});

			const recipients = await ctx.db.query.comment.findMany({
				where: and(eq(comment.threadId, input.threadId), ne(comment.authorId, ctx.auth.userId)),
				orderBy: [desc(comment.createdAt)],
				columns: {
					authorId: true
				}
			});
			const title = input.isAnonymous ? "Comment from anon" : `Comment from ${author}`;
			/*const notification = await ctx.magicbell.store.create({
				title,
				content: input.content,
				recipients: recipients.map(c => ({ external_id: c.authorId })),
				category: "comment",
				topic: dbComment.group.slug,
				action_url: `/${dbComment.group.slug}?messageId=${dbComment.thread.messageId}&commentId=${commentId}`
			});*/
			return dbComment;
		} catch (err) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Something went wrong!",
				cause: err
			});
		}
	})
});
