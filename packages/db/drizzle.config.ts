import type { Config } from "drizzle-kit";

import { connectionString } from "./src";

export default {
	schema: "./drizzle/schema.ts",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: { connectionString }
	// verbose: process.env.NODE_ENV !== "production"
} satisfies Config;
