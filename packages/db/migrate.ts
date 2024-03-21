// src/migrate.ts

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

// import { config } from "dotenv";
// config({ path: "../../env" });

export const connectionString = [
	"postgresql://",
	process.env.DB_ADMIN_USERNAME,
	":",
	process.env.DB_ADMIN_PASSWORD,
	"@",
	process.env.DB_HOST,
	"/",
	process.env.DB_NAME,
	"?sslmode=require"
].join("");

const sql = neon(connectionString);

// @ts-expect-error neon sql is weird
const db = drizzle(sql);

const main = async () => {
	try {
		await migrate(db, { migrationsFolder: "drizzle" });

		console.log("Migration completed ✅");
	} catch (error) {
		console.error("Error during migration:", error);

		process.exit(1);
	}
};

main().catch(e => {
	console.error("Migration failed 🛑");
	console.error(e);
	process.exit(1);
});
