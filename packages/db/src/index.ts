import { Client } from "@planetscale/database";
import { PrismaClient } from "@prisma/client/edge"; // Import from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { schema } from "./schema";

export { mySqlTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

const psClient = new Client({
	host: process.env.DB_HOST!,
	username: process.env.DB_USERNAME!,
	password: process.env.DB_PASSWORD!
});

const db = drizzle(psClient, { schema });

export type DrizzleClient = typeof db;

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

export const { user, groupUser, group, message, comment, reaction, thread, careerInterest, careerInterestToUser } =
	schema;

export { psClient, db, accelerateDB };
