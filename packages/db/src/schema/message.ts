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

export const message = mysqlTable(
	"Message",
	{
		id: int("id").autoincrement().notNull(),
		content: varchar("content", { length: 191 }).notNull(),
		createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3)`)
			.notNull(),
		updatedAt: datetime("updatedAt", { mode: "date", fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
			.notNull(),
		messageId: varchar("messageId", { length: 191 }).notNull(),
		authorId: varchar("authorId", { length: 191 }).notNull(),
		groupId: varchar("groupId", { length: 191 }).notNull(),
		type: mysqlEnum("type", ["NORMAL", "EVENT", "ANNOUNCEMENT"]).default("NORMAL").notNull()
	},
	table => {
		return {
			authorIdGroupIdIdx: index("Message_authorId_groupId_idx").on(table.authorId, table.groupId),
			messageId: primaryKey({ columns: [table.id], name: "Message_id" }),
			messageMessageIdKey: unique("Message_messageId_key").on(table.messageId)
		};
	}
);
