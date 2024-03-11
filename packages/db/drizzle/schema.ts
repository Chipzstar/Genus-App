import {
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	timestamp,
	uniqueIndex,
	varchar
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

export const careerInterestSlug = pgEnum("careerInterest_slug", ["law", "tech", "consulting", "banking_finance"]);
export const groupUserRole = pgEnum("groupUser_role", ["ADMIN", "EXPERT", "MEMBER"]);
export const messageType = pgEnum("message_type", ["NORMAL", "EVENT", "ANNOUNCEMENT"]);
export const userGender = pgEnum("user_gender", ["male", "female", "non_binary", "other"]);
export const userProfileType = pgEnum("user_profileType", ["STUDENT", "ADMIN", "EXPERT"]);
export const userEthnicity = pgEnum("user_ethnicity", [
	"english__welsh__scottish__northern_irish_or_british",
	"irish",
	"gypsy_or_irish_traveller",
	"roma",
	"any_other_white_background",
	"caribbean",
	"african",
	"any_other_black__black_british__or_caribbean_background",
	"indian",
	"pakistani",
	"bangladeshi",
	"chinese",
	"any_other_asian_background",
	"white_and_black_caribbean",
	"white_and_black_african",
	"white_and_asian",
	"any_other_mixed_or_multiple_ethnic_background",
	"arab",
	"any_other_ethnic_group"
]);

export const careerInterest = pgTable(
	"careerInterest",
	{
		id: serial("id").primaryKey().notNull(),
		slug: careerInterestSlug("slug").notNull()
	},
	table => {
		return {
			idx49236CareerInterestSlugKey: uniqueIndex("idx_49236_careerInterest_slug_key").on(table.slug)
		};
	}
);

export const comment = pgTable(
	"comment",
	{
		id: serial("id").primaryKey().notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		commentId: varchar("commentId", { length: 191 }).notNull(),
		content: varchar("content", { length: 191 }).notNull(),
		authorId: varchar("authorId", { length: 191 }).notNull(),
		threadId: varchar("threadId", { length: 191 }).notNull(),
		groupId: varchar("groupId", { length: 191 }).notNull()
	},
	table => {
		return {
			idx49241CommentAuthorIdThreadIdGroupIdIdx: index("idx_49241_comment_authorId_threadId_groupId_idx").on(
				table.authorId,
				table.threadId,
				table.groupId
			),
			idx49241CommentCommentIdKey: uniqueIndex("idx_49241_comment_commentId_key").on(table.commentId)
		};
	}
);

export const group = pgTable(
	"group",
	{
		id: serial("id").primaryKey().notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		groupId: varchar("groupId", { length: 191 }).notNull(),
		slug: varchar("slug", { length: 191 }).notNull(),
		name: varchar("name", { length: 191 }).notNull()
	},
	table => {
		return {
			idx49250GroupGroupidKey: uniqueIndex("idx_49250_group_groupId_key").on(table.groupId),
			idx49250GroupSlugKey: uniqueIndex("idx_49250_group_slug_key").on(table.slug)
		};
	}
);

export const groupUser = pgTable(
	"groupUser",
	{
		id: serial("id").primaryKey().notNull(),
		userId: varchar("userId", { length: 191 }).notNull(),
		groupId: varchar("groupId", { length: 191 }).notNull(),
		role: groupUserRole("role").default("MEMBER").notNull(),
		firstname: varchar("firstname", { length: 191 }),
		imageUrl: varchar("imageUrl", { length: 191 }),
		lastname: varchar("lastname", { length: 191 })
	},
	table => {
		return {
			groupUserGroupToUserIdx: index("groupUser_userId_groupId_idx").on(table.userId, table.groupId)
		};
	}
);

export const message = pgTable(
	"message",
	{
		id: serial("id").primaryKey().notNull(),
		content: varchar("content", { length: 191 }).notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
		messageId: varchar("messageId", { length: 191 }).notNull(),
		authorId: varchar("authorId", { length: 191 }).notNull(),
		groupId: varchar("groupId", { length: 191 }).notNull(),
		type: messageType("type").default("NORMAL").notNull()
	},
	table => {
		return {
			idx49267MessageMessageIdKey: uniqueIndex("idx_49267_message_messageId_key").on(table.messageId),
			idx49267MessageAuthorIdGroupIdIdx: index("idx_49267_message_authorId_groupId_idx").on(
				table.authorId,
				table.groupId
			)
		};
	}
);

export const reaction = pgTable(
	"reaction",
	{
		id: serial("id").primaryKey().notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		reactionId: varchar("reactionId", { length: 191 }).notNull(),
		authorId: varchar("authorId", { length: 191 }).notNull(),
		messageId: integer("messageId"),
		commentId: integer("commentId"),
		emoji: varchar("emoji", { length: 191 }).notNull(),
		code: varchar("code", { length: 191 }).notNull()
	},
	table => {
		return {
			idx49277ReactionAuthorIdMessageIdCommentIdIdx: index(
				"idx_49277_reaction_authorId_messageId_commentId_idx"
			).on(table.authorId, table.messageId, table.commentId),
			idx49277ReactionReactionidKey: uniqueIndex("idx_49277_reaction_reactionId_key").on(table.reactionId)
		};
	}
);

export const thread = pgTable(
	"thread",
	{
		id: serial("id").primaryKey().notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		threadId: varchar("threadId", { length: 191 }).notNull(),
		content: varchar("content", { length: 191 }).notNull(),
		authorId: varchar("authorId", { length: 191 }).notNull(),
		messageId: integer("messageId").notNull(),
		groupId: varchar("groupId", { length: 191 }).notNull()
	},
	table => {
		return {
			idx49286ThreadAuthoridMessageidGroupidIdx: index("idx_49286_thread_authorId_messageId_groupId_idx").on(
				table.authorId,
				table.messageId,
				table.groupId
			),
			idx49286ThreadThreadidKey: uniqueIndex("idx_49286_thread_threadId_key").on(table.threadId),
			idx49286ThreadMessageidKey: uniqueIndex("idx_49286_thread_messageId_key").on(table.messageId)
		};
	}
);

export const user = pgTable(
	"user",
	{
		id: serial("id").primaryKey().notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
		clerkId: varchar("clerkId", { length: 191 }).notNull(),
		email: varchar("email", { length: 191 }).notNull(),
		firstname: varchar("firstname", { length: 191 }).notNull(),
		lastname: varchar("lastname", { length: 191 }).notNull(),
		gender: userGender("gender").default("female").notNull(),
		completionYear: integer("completionYear").notNull(),
		broadDegreeCourse: varchar("broadDegreeCourse", { length: 191 }).notNull(),
		university: varchar("university", { length: 191 }).notNull(),
		degreeName: varchar("degreeName", { length: 191 }).notNull(),
		imageKey: varchar("imageKey", { length: 191 }),
		imageUrl: varchar("imageUrl", { length: 191 }),
		clerkImageHash: varchar("clerkImageHash", { length: 191 }),
		profileType: userProfileType("profileType").default("STUDENT").notNull(),
		ethnicity: userEthnicity("ethnicity").default("african").notNull()
	},
	table => {
		return {
			clerkIdUserIdx: uniqueIndex("clerkIdIdx").on(table.clerkId),
			emailUserIdx: uniqueIndex("emailIdx").on(table.email)
		};
	}
);

export const careerInterestToUser = pgTable(
	"careerInterestToUser",
	{
		careerInterestId: integer("careerInterestId").notNull(),
		userId: integer("userId").notNull()
	},
	table => {
		return {
			pk: primaryKey({ name: "careerInterestUserId", columns: [table.careerInterestId, table.userId] })
		};
	}
);

/*******************************************************************************
 *****************************  RELATIONS  **************************************/
/*******************************************************************************/
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
	careerInterests: many(careerInterestToUser)
}));

export const careerInterestRelations = relations(careerInterest, ({ one, many }) => ({
	user: many(careerInterestToUser)
}));

export const careerInterestToUserRelations = relations(careerInterestToUser, ({ one }) => ({
	user: one(user, {
		fields: [careerInterestToUser.userId],
		references: [user.id]
	}),
	careerInterest: one(careerInterest, {
		fields: [careerInterestToUser.careerInterestId],
		references: [careerInterest.id]
	})
}));

const schema = {
	user,
	group,
	message,
	comment,
	reaction,
	thread,
	groupUser,
	careerInterest,
	careerInterestToUser,
	usersRelations,
	groupRelations,
	messageRelations,
	commentRelations,
	threadRelations,
	groupUserRelations,
	reactionRelations,
	careerInterestToUserRelations,
	careerInterestRelations
};

export default schema;
