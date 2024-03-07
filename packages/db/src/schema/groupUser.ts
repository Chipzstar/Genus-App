import { index, int, mysqlEnum, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core'

export const groupUser = mysqlTable("GroupUser", {
	  id: int("id").autoincrement().notNull(),
	  userId: varchar("userId", { length: 191 }).notNull(),
	  groupId: varchar("groupId", { length: 191 }).notNull(),
	  role: mysqlEnum("role", ['ADMIN','EXPERT','MEMBER']).default('MEMBER').notNull(),
	  firstname: varchar("firstname", { length: 191 }),
	  imageUrl: varchar("imageUrl", { length: 191 }),
	  lastname: varchar("lastname", { length: 191 }),
  },
  (table) => {
	  return {
		  userIdGroupIdIdx: index("GroupUser_userId_groupId_idx").on(table.userId, table.groupId),
		  groupUserId: primaryKey({ columns: [table.id], name: "GroupUser_id"}),
	  }
  });
