import type {PrismaClient} from '@prisma/client';
import {log} from 'next-axiom';
import {DeletedObjectJSON, UserJSON, UserWebhookEvent, WebhookEvent} from '@clerk/nextjs/dist/types/api';
import {utapi} from "~/server/uploadthing";
import shortHash from 'shorthash2';
import {clerkClient} from '@clerk/nextjs';
import {UploadFileResponse} from 'uploadthing/client';

export const createNewUser = async ({event, prisma}: { event: UserWebhookEvent; prisma: PrismaClient }) => {
    try {
        const payload = event.data as UserJSON;
        const careerInterests = payload.unsafe_metadata["career_interests"] as string[]
        // create the user
        const user = await prisma.user.create({
            data: {
                clerkId: String(event.data.id),
                email: String(payload.email_addresses[0]?.email_address),
                firstname: payload.first_name,
                lastname: payload.last_name,
                gender: payload.unsafe_metadata["gender"] as string,
                university: payload.unsafe_metadata["university"] as string,
                degreeName: payload.unsafe_metadata["degree_name"] as string,
                completionYear: Number(payload.unsafe_metadata["completion_year"]),
                broadDegreeCourse: payload.unsafe_metadata["broad_degree_course"] as string
            }
        });
        // add the user to the relevant career interest record
        await Promise.all(careerInterests.map((slug) => {
            prisma.careerInterest.update({
                where: {
                    slug
                },
                data: {
                    users: {
                        connect: {id: user.id}
                    }
                },
                include: {
                    users: true,
                },
            }).then((result) => console.log(`${slug} assigned to user ${user.clerkId}\n${JSON.stringify(result, null, 2)}`));
        }))
        log.info('-----------------------------------------------');
        log.debug('New user!!', user);
        log.info('-----------------------------------------------');
        return user;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const updateUser = async ({event, prisma}: { event: UserWebhookEvent; prisma: PrismaClient }) => {
    try {
        let uploadedFile;
        const payload = event.data as UserJSON;
        // check if the user already exists in the db
        let user = await prisma.user.findFirstOrThrow({
            where: {
                clerkId: event.data.id
            }
        });
        const careerInterests = payload.unsafe_metadata["career_interests"] as string[]
        // check if the user has an "imageUrl" field. If they do continue
        const newImage = !user.imageUrl && payload.has_image
        const changedImage = user.imageUrl && user.clerkImageHash !== shortHash(payload.image_url)
        // console.table({newImage, changedImage, currHash: user.clerkImageHash, newHash: shortHash(payload.image_url)})
        if (newImage || changedImage) {
            const fileUrl = payload.image_url;
            uploadedFile = await utapi.uploadFilesFromUrl(fileUrl);
        }
        // if a new image was uploaded, delete the old one
        if (uploadedFile?.data) {
            if (user.imageKey) await utapi.deleteFiles([user.imageKey]);
            // update the imageHash within the clerk account
            const clerkUser = await clerkClient.users.updateUser(payload.id, {
                privateMetadata: {
                    ...payload.private_metadata,
                    image_hash: shortHash(payload.image_url),
                    ut_key: uploadedFile.data.key,
                    ut_url: uploadedFile.data.url
                }
            });
            log.info('-----------------------------------------------');
            log.debug('Updated clerk user!!', clerkUser);
            log.info('-----------------------------------------------');
        }
        const shouldUpdate = uploadedFile ||
            user.email !== payload.email_addresses[0]?.email_address ||
            user.firstname !== payload.first_name || user.lastname !== payload.last_name;
        // update the user in the db
        if (shouldUpdate)
            user = await prisma.user.update({
                where: {
                    clerkId: event.data.id
                },
                data: {
                    email: payload.email_addresses[0]?.email_address,
                    firstname: payload.first_name,
                    lastname: payload.last_name,
                    ...(uploadedFile?.data && {imageKey: uploadedFile.data?.key}),
                    ...(uploadedFile?.data && {imageUrl: uploadedFile.data?.url}),
                    ...(uploadedFile?.data && {clerkImageHash: shortHash(payload.image_url)})
                }
            });
        log.info('-----------------------------------------------');
        log.debug('Updated user!!', user);
        log.info('-----------------------------------------------');
        return user;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const deleteUser = async ({event, prisma}: { event: UserWebhookEvent; prisma: PrismaClient }) => {
    try {
        const payload = event.data as DeletedObjectJSON;
        // disconnect any career interests
        let user = await prisma.user.update({
            where: {
                clerkId: payload.id
            },
            data: {
                careerInterests: {
                    set: []
                }
            }
        });
        user = await prisma.user.delete({
            where: {
                clerkId: payload.id
            }
        });
        if (user) {
            log.info('-----------------------------------------------');
            log.debug('User deleted!!', user);
            log.info('-----------------------------------------------');
        }
        return;
    } catch (err: any) {
        console.error(err.meta);
        // console.error(err.meta.cause);
        return err.meta.cause;
    }
};
