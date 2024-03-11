// src/migrate.ts

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

import { connectionString } from "./src";

// import { config } from "dotenv";

// config({ path: "../../env" });

const sql = neon(connectionString);

// @ts-expect-error
const db = drizzle(sql);

const main = async () => {
	try {
		await migrate(db, { migrationsFolder: "drizzle" });

		console.log("Migration completed");
	} catch (error) {
		console.error("Error during migration:", error);

		process.exit(1);
	}
};

main().catch(e => {
	console.error("Migration failed");
	console.error(e);
	process.exit(1);
});
