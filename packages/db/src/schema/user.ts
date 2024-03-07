import { sql } from "drizzle-orm";
import { datetime, int, mysqlEnum, mysqlTable, primaryKey, unique, varchar } from "drizzle-orm/mysql-core";

export const user = mysqlTable(
	"User",
	{
		id: int("id").autoincrement().notNull(),
		createdAt: datetime("createdAt", { mode: "date", fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3)`)
			.notNull(),
		updatedAt: datetime("updatedAt", { mode: "date", fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
			.notNull(),
		clerkId: varchar("clerkId", { length: 191 }).notNull(),
		email: varchar("email", { length: 191 }).notNull(),
		firstname: varchar("firstname", { length: 191 }).notNull(),
		lastname: varchar("lastname", { length: 191 }).notNull(),
		gender: mysqlEnum("gender", ["male", "female", "non_binary", "other"]).default("female").notNull(),
		completionYear: int("completionYear").notNull(),
		broadDegreeCourse: varchar("broadDegreeCourse", { length: 191 }).notNull(),
		university: varchar("university", { length: 191 }).notNull(),
		degreeName: varchar("degreeName", { length: 191 }).notNull(),
		imageKey: varchar("imageKey", { length: 191 }),
		imageUrl: varchar("imageUrl", { length: 191 }),
		clerkImageHash: varchar("clerkImageHash", { length: 191 }),
		profileType: mysqlEnum("profileType", ["STUDENT", "ADMIN", "EXPERT"]).default("STUDENT").notNull(),
		ethnicity: mysqlEnum("ethnicity", [
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
		])
			.default("african")
			.notNull()
	},
	table => {
		return {
			userId: primaryKey({ columns: [table.id], name: "User_id" }),
			userClerkIdKey: unique("User_clerkId_key").on(table.clerkId),
			userEmailKey: unique("User_email_key").on(table.email)
		};
	}
);
