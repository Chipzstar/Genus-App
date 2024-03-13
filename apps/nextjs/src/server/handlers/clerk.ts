import { clerkClient } from "@clerk/nextjs";
import type { DeletedObjectJSON, UserJSON, UserWebhookEvent } from "@clerk/nextjs/dist/types/api";
import { log } from "next-axiom";
import shortHash from "shorthash2";
import type * as z from "zod";

import type { careerInterest} from "@genus/db";
import { careerInterestToUser, db, eq, user } from "@genus/db";
import { magicbell } from "@genus/magicbell";
import type { ethnicitiesSchema, gendersSchema } from "@genus/validators";

import { utapi } from "~/server/uploadthing";
import { CAREER_INTERESTS } from "~/utils";

// const MAGICBELL_API_SECRET = process.env.MAGICBELL_API_SECRET!;

type CareerInterestSlug = typeof careerInterest.$inferSelect.slug;

export const createNewUser = async ({ event }: { event: UserWebhookEvent }) => {
	try {
		const payload = event.data as UserJSON;
		const careerInterestsPayload = payload.unsafe_metadata.career_interests as CareerInterestSlug[];
		// create the user
		await db.insert(user).values({
			clerkId: String(payload.id),
			email: String(payload.email_addresses[0]?.email_address),
			firstname: payload.first_name,
			lastname: payload.last_name,
			gender: payload.unsafe_metadata.gender as z.infer<typeof gendersSchema>,
			ethnicity: payload.unsafe_metadata.ethnicity as z.infer<typeof ethnicitiesSchema>,
			university: payload.unsafe_metadata.university as string,
			degreeName: payload.unsafe_metadata.degree_name as string,
			completionYear: Number(payload.unsafe_metadata.completion_year),
			broadDegreeCourse: payload.unsafe_metadata.broad_degree_course as string,
			profileType: "STUDENT"
		});

		const dbUser = (await db.select().from(user).where(eq(user.clerkId, payload.id)))[0];

		if (!dbUser) throw new Error("Could not create user");

		const magicBellUser = await magicbell.users.create({
			external_id: payload.id,
			email: payload.email_addresses[0]?.email_address,
			first_name: payload.first_name,
			last_name: payload.last_name,
			custom_attributes: {
				profileType: dbUser.profileType
			}
		});

		// add the user to the relevant career interest record
		const queries = careerInterestsPayload.map(slug => {
			return {
				careerInterestId: CAREER_INTERESTS[slug],
				userId: dbUser.id
			};
		});
		await db.insert(careerInterestToUser).values(queries);
		/*const userEmailHMAC = Base64.stringify(hmacSHA256(dbUser.email, MAGICBELL_API_SECRET));
				// attach the HMAC record to the clerk user external_id
				await clerkClient.users.updateUser(payload.id, {
					externalId: userEmailHMAC
				});*/
		log.info("-----------------------------------------------");
		log.debug("New user!!", dbUser);
		log.info("-----------------------------------------------");
		return {
			dbUser,
			magicBellUser
		};
	} catch (err: any) {
		console.error(err);
		log.error(err.message, err);
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

		/*console.table({
			newImage,
			changedImage,
			currHash: dbUser.clerkImageHash,
			newHash: shortHash(payload.image_url)
		});*/

		if (newImage || changedImage) {
			const fileUrl = payload.image_url;
			uploadedFile = await utapi.uploadFilesFromUrl(fileUrl);
		}
		console.log("************************************************")
		console.log(uploadedFile?.data)
		console.log("************************************************")

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
			log.info("-----------------------------------------------");
			log.debug("Updated clerk user!!", clerkUser);
			log.info("-----------------------------------------------");
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
			dbUser = (await db
				.update(user)
				.set({
					firstname: payload.first_name,
					lastname: payload.last_name,
					...(uploadedFile?.data && { imageKey: uploadedFile.data.key }),
					...(uploadedFile?.data && { imageUrl: uploadedFile.data.url }),
					...(uploadedFile?.data && { clerkImageHash: shortHash(payload.image_url) })
				})
				.where(eq(user.clerkId, payload.id))
				.returning())[0];
		log.info("-----------------------------------------------");
		log.debug("Updated user!!", dbUser);
		log.info("-----------------------------------------------");
		return dbUser;
	} catch (err: any) {
		console.error(err);
		log.error(err.message, err);
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
		// delete the user in db
		await db.delete(user).where(eq(user.clerkId, payload.id!));
		// delete the magicbell user
		await magicbell.users.delete(`external_id:${payload.id}`);
		if (user) {
			log.info("-----------------------------------------------");
			log.debug("User deleted!!", dbUser);
			log.info("-----------------------------------------------");
		}
		return;
	} catch (err: any) {
		console.error(err.meta);
		log.error(err.message, err);
		return err.meta.cause;
	}
};
