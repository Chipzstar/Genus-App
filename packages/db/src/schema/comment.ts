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

export const comment = mysqlTable(
	"Comment",
	{
		id: int("id").autoincrement().notNull(),
		createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3)`)
			.notNull(),
		updatedAt: datetime("updatedAt", { mode: "date", fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
			.notNull(),
		commentId: varchar("commentId", { length: 191 }).notNull(),
		content: varchar("content", { length: 191 }).notNull(),
		authorId: varchar("authorId", { length: 191 }).notNull(),
		threadId: varchar("threadId", { length: 191 }).notNull(),
		groupId: varchar("groupId", { length: 191 }).notNull()
	},
	table => {
		return {
			authorIdThreadIdGroupIdIdx: index("Comment_authorId_threadId_groupId_idx").on(
				table.authorId,
				table.threadId,
				table.groupId
			),
			commentId: primaryKey({ columns: [table.id], name: "Comment_id" }),
			commentCommentIdKey: unique("Comment_commentId_key").on(table.commentId)
		};
	}
);
