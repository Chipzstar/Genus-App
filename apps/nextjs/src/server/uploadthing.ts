import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import type { FileRouter } from "uploadthing/next-legacy";
import { createUploadthing } from "uploadthing/next-legacy";

import { db, eq, user } from "@genus/db";

const f = createUploadthing();

function defineMiddleware(authMsg: string) {
	return async ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
		const { userId } = getAuth(req);
		console.log({ userId });
		if (!userId) throw new Error(authMsg);
		return { userId };
	};
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	signupUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
		// Set permissions and file types for this FileRoute
		.middleware(defineMiddleware("This user has not yet been authenticated"))
		.onUploadError(({ error }) => {
			console.log(error);
			throw error;
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log("Upload complete for userId:", metadata.userId);
			console.log("file url", file.url);
			// update the user with the new image url + image key in the database
			await db
				.update(user)
				.set({
					imageKey: file.key,
					imageUrl: file.url
				})
				.where(eq(user.clerkId, metadata.userId));
			return {
				uploadedBy: metadata.userId,
				imageKey: file.key,
				imageUrl: file.url
			};
		}),
	profileUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
		.middleware(defineMiddleware("This user is not logged in."))
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log("Upload complete for userId:", metadata.userId);
			console.log("file key", file.key);
			console.log("file url", file.url);
			// update the user with the new image url + image key in the database
			const dbUser = (
				await db
					.update(user)
					.set({
						imageKey: file.key,
						imageUrl: file.url
					})
					.where(eq(user.clerkId, metadata.userId))
					.returning()
			)[0];

			console.log(dbUser);
			return {
				uploadedBy: metadata.userId,
				imageKey: file.key,
				imageUrl: file.url
			};
		}),
	businessFileUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
		.middleware(defineMiddleware("This user is not logged in."))
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log("Upload complete for userId:", metadata.userId);
			console.log("file key", file.key);
			console.log("file url", file.url);
			return { uploadedBy: metadata?.userId ?? "anonymous" };
		})
} as FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export type ProfileUploader = OurFileRouter["profileUploader"];

export type BusinessFileUploader = OurFileRouter["businessFileUploader"];
