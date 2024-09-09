/*******************************************************************************
 *****************************  RELATIONS  *************************************
/*******************************************************************************/

import { relations } from "drizzle-orm/relations";

import {
	business,
	businessToUser,
	comment,
	company,
	companyToUser,
	group,
	groupUser,
	hobbyInterest,
	hobbyInterestToUser,
	message,
	reaction,
	resource,
	review,
	skillset,
	skillsetToUser,
	thread,
	user
} from "./schema";

export const messageRelations = relations(message, ({ one, many }) => ({
	reactions: many(reaction),
	group: one(group, {
		fields: [message.groupId],
		references: [group.groupId]
	}),
	author: one(user, {
		fields: [message.authorId],
		references: [user.clerkId]
	}),
	thread: one(thread)
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
	members: many(groupUser),
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
	}),
	message: one(message, {
		fields: [reaction.messageId],
		references: [message.id]
	}),
	commentId: one(comment, {
		fields: [reaction.commentId],
		references: [comment.id]
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

export const usersRelations = relations(user, ({ one, many }) => ({
	messages: many(message),
	comments: many(comment),
	reactions: many(reaction),
	threads: many(thread),
	groupUsers: many(groupUser),
	companies: many(companyToUser),
	hobbies: many(hobbyInterestToUser),
	resources: many(resource)
}));

export const businessRelations = relations(business, ({ one, many }) => ({
	businessMembers: many(businessToUser),
	owner: one(user, {
		fields: [business.ownerId],
		references: [user.clerkId]
	})
}));

export const resourceRelations = relations(resource, ({ one, many }) => ({
	author: one(user, {
		fields: [resource.authorId],
		references: [user.clerkId]
	})
}));

export const companyRelations = relations(company, ({ one, many }) => ({
	users: many(companyToUser),
	reviews: many(review)
}));

export const reviewRelations = relations(review, ({ one, many }) => ({
	company: one(company, {
		fields: [review.companyId],
		references: [company.companyId]
	})
}));

export const skillsetRelations = relations(skillset, ({ one, many }) => ({
	users: many(skillsetToUser)
}));

export const skillsetToUserRelations = relations(skillsetToUser, ({ one }) => ({
	user: one(user, {
		fields: [skillsetToUser.userId],
		references: [user.id]
	}),
	skillset: one(skillset, {
		fields: [skillsetToUser.skillsetId],
		references: [skillset.id]
	})
}));

export const companyToUserRelations = relations(companyToUser, ({ one }) => ({
	user: one(user, {
		fields: [companyToUser.userId],
		references: [user.id]
	}),
	company: one(company, {
		fields: [companyToUser.companyId],
		references: [company.id]
	})
}));

export const hobbyInterestToUserRelations = relations(hobbyInterestToUser, ({ one }) => ({
	user: one(user, {
		fields: [hobbyInterestToUser.userId],
		references: [user.id]
	}),
	hobbyInterest: one(hobbyInterest, {
		fields: [hobbyInterestToUser.hobbyInterestId],
		references: [hobbyInterest.id]
	})
}));

export const businessToUserRelations = relations(businessToUser, ({ one }) => ({
	user: one(user, {
		fields: [businessToUser.userId],
		references: [user.id]
	}),
	business: one(business, {
		fields: [businessToUser.businessId],
		references: [business.id]
	})
}));
