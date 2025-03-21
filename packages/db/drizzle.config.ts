import type { Config } from "drizzle-kit";

import { connectionString } from "./src";

export default {
	schema: "./drizzle/schemas/*.ts",
	out: "./drizzle",
	dbCredentials: { url: connectionString },
	dialect: "postgresql",
	verbose: false
} satisfies Config;
