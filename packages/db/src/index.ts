import { neon } from "@neondatabase/serverless";
import { PrismaClient } from "@prisma/client/edge"; // Import from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { drizzle } from "drizzle-orm/neon-http";

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
const db = drizzle(sql);

export type DrizzleClient = typeof db;

export { mySqlTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

const createStandardPrismaClient = () => {
	return new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
	});
};

// Singleton pattern for creating an accelerated PrismaClient instance.
const createAcceleratedPrismaClient = () => {
	return new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
	}).$extends(withAccelerate());
};

// Define a type for the accelerated client.
type PrismaClientAccelerated = ReturnType<typeof createAcceleratedPrismaClient>;

const globalForPrisma = globalThis as unknown as {
	standardPrisma: PrismaClient | undefined;
	acceleratedPrisma: PrismaClientAccelerated | undefined;
};

const accelerateDB = globalForPrisma.acceleratedPrisma ?? createAcceleratedPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.acceleratedPrisma = accelerateDB;
}

export * from "@prisma/client";

export { sql, db, accelerateDB };
