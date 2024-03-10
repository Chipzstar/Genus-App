import { sql } from "drizzle-orm";
import { index, integer, pgEnum, pgTable, serial, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

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
		completionYear: integer("completionyear").notNull(),
		broadDegreeCourse: varchar("broaddegreecourse", { length: 191 }).notNull(),
		university: varchar("university", { length: 191 }).notNull(),
		degreename: varchar("degreename", { length: 191 }).notNull(),
		imagekey: varchar("imagekey", { length: 191 }),
		imageurl: varchar("imageurl", { length: 191 }),
		clerkimagehash: varchar("clerkimagehash", { length: 191 }),
		profiletype: userProfileType("profileType").default("STUDENT").notNull(),
		ethnicity: userEthnicity("ethnicity").default("african").notNull()
	},
	table => {
		return {
			idx49295UserClerkidKey: uniqueIndex("idx_49295_user_clerkid_key").on(table.clerkid),
			idx49295UserEmailKey: uniqueIndex("idx_49295_user_email_key").on(table.email)
		};
	}
);
