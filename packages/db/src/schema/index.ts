import { relations } from "drizzle-orm";

import { careerInterest } from "./careerInterest";
import { careerInterestToUser } from "./careerInterestToUser";
import { comment } from "./comment";
import { group } from "./group";
import { groupUser } from "./groupUser";
import { message } from "./message";
import { reaction } from "./reaction";
import { thread } from "./thread";
import { user } from "./user";

/*******************************************************************************
 *****************************  RELATIONS  **************************************/
/*******************************************************************************/
export const usersRelations = relations(user, ({ one, many }) => ({
	messages: many(message),
	comments: many(comment),
	reactions: many(reaction),
	threads: many(thread),
	groups: many(group),
	groupUsers: many(groupUser),
	careerInterests: many(careerInterestToUser)
}));

export const messageRelations = relations(message, ({ one, many }) => ({
	reactions: many(reaction),
	group: one(group, {
		fields: [message.groupId],
		references: [group.groupId]
	}),
	author: one(user, {
		fields: [message.authorId],
		references: [user.clerkId]
	})
}));

export const commentRelations = relations(comment, ({ one, many }) => ({
	reactions: many(reaction),
	author: one(user, {
		fields: [comment.authorId],
		references: [user.clerkId]
	}),
	group: one(group, {
		fields: [comment.groupId],
		references: [group.groupId]
	}),
	thread: one(thread, {
		fields: [comment.threadId],
		references: [thread.threadId]
	})
}));

export const groupRelations = relations(group, ({ one, many }) => ({
	groupUsers: many(groupUser),
	messages: many(message),
	threads: many(thread)
}));

export const groupUserRelations = relations(groupUser, ({ one, many }) => ({
	group: one(group, {
		fields: [groupUser.groupId],
		references: [group.groupId]
	}),
	user: one(user, {
		fields: [groupUser.userId],
		references: [user.clerkId]
	})
}));

export const reactionRelations = relations(reaction, ({ one }) => ({
	author: one(user, {
		fields: [reaction.authorId],
		references: [user.clerkId]
	})
}));

export const threadRelations = relations(thread, ({ one, many }) => ({
	comments: many(comment),
	author: one(user, {
		fields: [thread.authorId],
		references: [user.clerkId]
	}),
	group: one(group, {
		fields: [thread.groupId],
		references: [group.groupId]
	}),
	message: one(message, {
		fields: [thread.messageId],
		references: [message.id]
	})
}));

export const careerInterestRelations = relations(careerInterest, ({ one, many }) => ({
	user: many(careerInterestToUser)
}));

export const careerInterestToUserRelations = relations(careerInterestToUser, ({ one }) => ({
	user: one(user, {
		fields: [careerInterestToUser.b],
		references: [user.id]
	}),
	careerInterest: one(careerInterest, {
		fields: [careerInterestToUser.a],
		references: [careerInterest.id]
	})
}));
