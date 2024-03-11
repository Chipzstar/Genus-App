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

export const thread = mysqlTable(
	"Thread",
	{
		id: int("id").autoincrement().notNull(),
		createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3)`)
			.notNull(),
		updatedAt: datetime("updatedAt", { mode: "date", fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
			.notNull(),
		threadId: varchar("threadId", { length: 191 }).notNull(),
		content: varchar("content", { length: 191 }).notNull(),
		authorId: varchar("authorId", { length: 191 }).notNull(),
		messageId: int("messageId").notNull(),
		groupId: varchar("groupId", { length: 191 }).notNull()
	},
	table => {
		return {
			authorIdMessageIdGroupIdIdx: index("Thread_authorId_messageId_groupId_idx").on(
				table.authorId,
				table.messageId,
				table.groupId
			),
			threadId: primaryKey({ columns: [table.id], name: "Thread_id" }),
			threadThreadIdKey: unique("Thread_threadId_key").on(table.threadId),
			threadMessageIdKey: unique("Thread_messageId_key").on(table.messageId)
		};
	}
);
