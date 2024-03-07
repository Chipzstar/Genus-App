import * as process from "process";
import type { Config } from "drizzle-kit";

const uri = [
	"mysql://",
	process.env.DB_USERNAME,
	":",
	process.env.DB_PASSWORD,
	"@",
	process.env.DB_HOST,
	"/",
	process.env.DB_NAME,
	'?ssl={"rejectUnauthorized":true}'
].join("");

export default {
	schema: [
		"./src/schema/user.ts",
		"./src/schema/groupUser.ts",
		"./src/schema/group.ts",
		"./src/schema/message.ts",
		"./src/schema/reaction.ts",
		"./src/schema/thread.ts",
		"./src/schema/comment.ts",
		"./src/schema/careerInterest.ts",
		"./src/schema/careerInterestToUser.ts"
	],
	out: "./drizzle",
	driver: "mysql2",
	dbCredentials: { uri },
	verbose: process.env.NODE_ENV !== "production"
} satisfies Config;
