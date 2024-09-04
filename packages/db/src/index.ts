import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTableCreator } from "drizzle-orm/pg-core";

import * as _relations from "../drizzle/schemas/relations";
import * as _schema from "../drizzle/schemas/schema";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM.
 * Use the same database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
const prefix = "";
export const tableCreator = pgTableCreator(name => prefix.concat(name));

export * from "../drizzle/schemas/schema";

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

const db = drizzle(sql, { schema: { ..._schema, ..._relations }, logger: false });

export type DrizzleClient = typeof db;

export * from "drizzle-orm";

export { sql, db };
