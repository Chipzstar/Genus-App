import type {PrismaClient} from '@prisma/client';
import {log} from 'next-axiom';
import {DeletedObjectJSON, UserJSON, UserWebhookEvent, WebhookEvent} from '@clerk/nextjs/dist/types/api';
import {formatString} from "~/utils";

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
                        connect: { id: user.id }
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
        const payload = event.data as UserJSON;
        // create the user
        const user = await prisma.user.update({
            where: {
                clerkId: event.data.id
            },
            data: {
                email: payload.email_addresses[0]?.email_address,
                firstname: payload.first_name,
                lastname: payload.last_name
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
