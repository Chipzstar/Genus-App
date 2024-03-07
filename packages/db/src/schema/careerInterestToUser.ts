import { index, int, mysqlTable, unique } from "drizzle-orm/mysql-core";

export const careerInterestToUser = mysqlTable(
	"_CareerInterestToUser",
	{
		a: int("A").notNull(),
		b: int("B").notNull()
	},
	table => {
		return {
			bIdx: index("_CareerInterestToUser_B_index").on(table.b),
			careerInterestToUserAbUnique: unique("_CareerInterestToUser_AB_unique").on(table.a, table.b)
		};
	}
);
