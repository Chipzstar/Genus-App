import { PrismaClient } from "@prisma/client/edge"; // Import from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";

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

const db = globalForPrisma.standardPrisma ?? createStandardPrismaClient();
const accelerateDB = globalForPrisma.acceleratedPrisma ?? createAcceleratedPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.standardPrisma = db;
	globalForPrisma.acceleratedPrisma = accelerateDB;
}

export * from "@prisma/client";

export { db, accelerateDB };

/*import { Group, Message, PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
	// allow global `var` declarations
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

export const prisma =
	global.prisma ||
	new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
	}).$extends(withAccelerate());


if (process.env.NODE_ENV !== "production") {
	global.prisma = prisma;
}*/
