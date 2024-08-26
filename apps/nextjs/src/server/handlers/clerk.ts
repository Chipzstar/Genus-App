import { clerkClient } from "@clerk/nextjs";
import type { DeletedObjectJSON, UserJSON, UserWebhookEvent } from "@clerk/nextjs/server";
import shortHash from "shorthash2";
import { UTApi } from "uploadthing/server";

import { posthog } from "@genus/api";
import { careerInterestToUser, db, eq, groupUser, reaction, user } from "@genus/db";

const utapi = new UTApi();

export const createNewUser = async ({ event }: { event: UserWebhookEvent }) => {
	try {
		const payload = event.data as UserJSON;
		const posthogUser = posthog.identify({
			distinctId: String(payload.id),
			properties: {
				email: payload.email_addresses[0]?.email_address,
				firstname: payload.first_name,
				lastname: payload.last_name
			}
		});
		// const waitingListEnabled = await posthog.isFeatureEnabled("waiting-list", String(payload.id));
		// log.info("Feature flag", { waitingListEnabled });
		// create the user
		await db.insert(user).values({
			clerkId: String(payload.id),
			email: String(payload.email_addresses[0]?.email_address),
			firstname: payload.first_name,
			lastname: payload.last_name,
			username: payload.unsafe_metadata.username as string,
			tempPassword: payload.unsafe_metadata.tempPassword as string,
			isActive: true
		});

		const dbUser = (await db.select().from(user).where(eq(user.clerkId, payload.id)))[0];

		if (!dbUser) throw new Error("Could not create user");

		// log.info("-----------------------------------------------");
		// log.debug("New user!!", dbUser);
		// log.info("-----------------------------------------------");
		return {
			dbUser,
			posthogUser
		};
	} catch (err: any) {
		console.error(err);
		// log.error(err.message, err);
		throw err;
	}
};

export const updateUser = async ({ event }: { event: UserWebhookEvent }) => {
	try {
		let uploadedFile;
		const payload = event.data as UserJSON;
		// check if the user already exists in the db
		let dbUser = (await db.select().from(user).where(eq(user.clerkId, payload.id)))[0];

		if (!dbUser) throw new Error("Could not find user");

		// check if the user has an "imageUrl" field. If they do continue
		const newImage = !dbUser.imageUrl && payload.has_image;
		// check if the new image is different from the last one they uploaded
		const changedImage = !!dbUser.imageUrl && dbUser.clerkImageHash !== shortHash(payload.image_url);

		console.table({
			dbImageUrl: dbUser.imageUrl,
			payloadImageUrl: payload.image_url,
			currHash: dbUser.clerkImageHash,
			newHash: shortHash(payload.image_url)
		});

		if (newImage || changedImage) {
			const fileUrl = payload.image_url;
			uploadedFile = await utapi.uploadFilesFromUrl(fileUrl);
		}

		// if a new image was uploaded, delete the old one
		if (uploadedFile?.data) {
			if (dbUser.imageKey) await utapi.deleteFiles([dbUser.imageKey]);
			// update the imageHash within the clerk account
			const clerkUser = await clerkClient.users.updateUser(payload.id, {
				privateMetadata: {
					...payload.private_metadata,
					image_hash: shortHash(payload.image_url),
					ut_key: uploadedFile.data.key,
					ut_url: uploadedFile.data.url
				}
			});
			// log.info("-----------------------------------------------");
			// log.debug("Updated clerk user!!", clerkUser);
			// log.info("-----------------------------------------------");
		}

		const shouldUpdate = Boolean(
			uploadedFile ??
				dbUser.email !== payload.email_addresses[0]?.email_address ??
				dbUser.firstname !== payload.first_name ??
				dbUser.lastname !== payload.last_name
		);

		console.table({ shouldUpdate });

		// update the user in the db
		if (shouldUpdate)
			dbUser = (
				await db
					.update(user)
					.set({
						firstname: payload.first_name,
						lastname: payload.last_name,
						...(uploadedFile?.data && { imageKey: uploadedFile.data.key }),
						...(uploadedFile?.data && { imageUrl: uploadedFile.data.url }),
						...(uploadedFile?.data && { clerkImageHash: shortHash(payload.image_url) })
					})
					.where(eq(user.clerkId, payload.id))
					.returning()
			)[0];
		// log.info("-----------------------------------------------");
		// log.debug("Updated user!!", dbUser);
		// log.info("-----------------------------------------------");
		return dbUser;
	} catch (err: any) {
		console.error(err);
		// log.error(err.message, err);
		throw err;
	}
};

export const deleteUser = async ({ event }: { event: UserWebhookEvent }) => {
	try {
		const payload = event.data as DeletedObjectJSON;
		// check if the user exists in the db
		const dbUser = (await db.select().from(user).where(eq(user.clerkId, payload.id!)))[0];
		if (!dbUser) throw new Error("Could not find user");
		// disconnect any career interests
		await db.delete(careerInterestToUser).where(eq(careerInterestToUser.userId, dbUser.id));
		// delete any entities in the DB that link directly to the user
		await db.delete(groupUser).where(eq(groupUser.userId, payload.id!));
		await db.delete(reaction).where(eq(reaction.authorId, payload.id!));
		// delete the user in db
		await db.delete(user).where(eq(user.clerkId, payload.id!));
		if (user) {
			// log.info("-----------------------------------------------");
			// log.debug("User deleted!!", dbUser);
			// log.info("-----------------------------------------------");
		}
		return;
	} catch (err: any) {
		console.error(err.meta);
		// log.error(err.message, err);
		return err.meta.cause;
	}
};
