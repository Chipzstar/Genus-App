import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import * as z from "zod";

import { and, eq, reaction } from "@genus/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

type ReactionOptionals =
	| {
			messageId: number;
			commentId?: never;
	  }
	| {
			messageId?: never;
			commentId: number;
	  };

export const reactionRouter = createTRPCRouter({
	getReaction: protectedProcedure
		.input(
			z.object({
				type: z.union([z.literal("message"), z.literal("comment")]),
				id: z.number()
			})
		)
		.query(async ({ ctx, input }) => {
			try {
				let dbReaction = null;
				if (input.type === "message") {
					dbReaction = await ctx.db.query.reaction.findFirst({
						where: and(eq(reaction.authorId, ctx.auth.userId), eq(reaction.messageId, input.id))
					});
				} else {
					dbReaction = await ctx.db.query.reaction.findFirst({
						where: and(eq(reaction.authorId, ctx.auth.userId), eq(reaction.commentId, input.id))
					});
				}
				return dbReaction;
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Something went wrong!",
					cause: err
				});
			}
		}),
	upsertReaction: protectedProcedure
		.input(
			z.object({
				id: z.number(),
				emoji: z.string(),
				code: z.string(),
				commentId: z.number().optional(),
				messageId: z.number().optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				let reactionId = `reaction_${nanoid(18)}`; //=> "V1StGXR8_Z5jdHi6B-myT"
				return await ctx.db
					.insert(reaction)
					.values({
						reactionId,
						...(input?.commentId && { commentId: input.commentId }),
						...(input?.messageId && { messageId: input.messageId }),
						authorId: ctx.auth.userId,
						emoji: input.emoji,
						code: input.code
					})
					.onConflictDoUpdate({
						where: and(eq(reaction.id, input.id), eq(reaction.authorId, ctx.auth.userId)),
						target: reaction.id,
						set: {
							emoji: input.emoji,
							code: input.code
						}
					});
			} catch (err) {
				console.error(err);
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Something went wrong!",
					cause: err
				});
			}
		}),
	deleteReaction: protectedProcedure
		.input(
			z.object({
				id: z.number()
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				return await ctx.db
					.delete(reaction)
					.where(and(eq(reaction.id, input.id), eq(reaction.authorId, ctx.auth.userId)));
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
