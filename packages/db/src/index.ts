import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import schema from "../drizzle/schema";

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

export { mySqlTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

export { sql, db };
