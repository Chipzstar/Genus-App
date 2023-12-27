import type { PrismaClient } from '@prisma/client';
import { log } from 'next-axiom';
import { DeletedObjectJSON, UserJSON, UserWebhookEvent, WebhookEvent } from '@clerk/nextjs/dist/types/api';

export const createNewUser = async ({ event, prisma }: { event: UserWebhookEvent; prisma: PrismaClient }) => {
    try {
        const payload = event.data as UserJSON;
        // create the user
        const user = await prisma.user.create({
            data: {
                clerkId: String(event.data.id),
                email: String(payload.email_addresses[0]?.email_address),
                firstname: payload.first_name,
                lastname: payload.last_name
            }
        });
        log.info('-----------------------------------------------');
        log.debug('New user!!', user);
        log.info('-----------------------------------------------');
        return user;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const updateUser = async ({ event, prisma }: { event: UserWebhookEvent; prisma: PrismaClient }) => {
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

export const deleteUser = async ({ event, prisma }: { event: UserWebhookEvent; prisma: PrismaClient }) => {
    try {
        const payload = event.data as DeletedObjectJSON;
        const user = await prisma.user.delete({
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
    } catch (err) {
        console.error(err);
        throw err;
    }
};
