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

export const group = mysqlTable(
	"Group",
	{
		id: int("id").autoincrement().notNull(),
		createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3)`)
			.notNull(),
		updatedAt: datetime("updatedAt", { mode: "date", fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
			.notNull(),
		groupId: varchar("groupId", { length: 191 }).notNull(),
		slug: varchar("slug", { length: 191 }).notNull(),
		name: varchar("name", { length: 191 }).notNull()
	},
	table => {
		return {
			groupId: primaryKey({ columns: [table.id], name: "Group_id" }),
			groupGroupIdKey: unique("Group_groupId_key").on(table.groupId),
			groupSlugKey: unique("Group_slug_key").on(table.slug)
		};
	}
);
