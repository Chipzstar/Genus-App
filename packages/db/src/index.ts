import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTableCreator } from "drizzle-orm/pg-core";

import * as schema from "../drizzle/schema";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM.
 * Use the same database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
const prefix = "";
export const tableCreator = pgTableCreator(name => prefix.concat(name));

export * from "../drizzle/schema";

export const connectionString = [
	"postgresql://",
	process.env.DB_USERNAME,
	":",
	process.env.DB_PASSWORD,
	"@",
	process.env.DB_HOST,
	"/",
	process.env.DB_NAME,
	"?sslmode=require"
].join("");

const sql = neon(connectionString);

const db = drizzle(sql, { schema });

export type DrizzleClient = typeof db;

export * from "drizzle-orm";

export { sql, db };
