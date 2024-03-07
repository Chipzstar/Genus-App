import {int, mysqlEnum, mysqlTable, primaryKey, unique} from 'drizzle-orm/mysql-core'

export const careerInterest = mysqlTable("CareerInterest", {
	  id: int("id").autoincrement().notNull(),
	  slug: mysqlEnum("slug", ['law','tech','consulting','banking_finance']).notNull(),
  },
  (table) => {
	  return {
		  careerInterestId: primaryKey({ columns: [table.id], name: "CareerInterest_id"}),
		  careerInterestSlugKey: unique("CareerInterest_slug_key").on(table.slug),
	  }
  });
