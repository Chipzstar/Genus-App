import { sql } from "drizzle-orm";
import {
	AnyMySqlColumn,
	datetime,
	index,
	int,
	mysqlEnum,
	mysqlSchema,
	mysqlTable,
	primaryKey,
	unique,
	varchar
} from "drizzle-orm/mysql-core";

export const reaction = mysqlTable(
	"Reaction",
	{
		id: int("id").autoincrement().notNull(),
		createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3)`)
			.notNull(),
		updatedAt: datetime("updatedAt", { mode: "date", fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
			.notNull(),
		reactionId: varchar("reactionId", { length: 191 }).notNull(),
		authorId: varchar("authorId", { length: 191 }).notNull(),
		messageId: int("messageId"),
		commentId: int("commentId"),
		emoji: varchar("emoji", { length: 191 }).notNull(),
		code: varchar("code", { length: 191 }).notNull()
	},
	table => {
		return {
			authorIdMessageIdCommentIdIdx: index("Reaction_authorId_messageId_commentId_idx").on(
				table.authorId,
				table.messageId,
				table.commentId
			),
			reactionId: primaryKey({ columns: [table.id], name: "Reaction_id" }),
			reactionReactionIdKey: unique("Reaction_reactionId_key").on(table.reactionId)
		};
	}
);
