import type { NextApiRequest, NextApiResponse } from 'next';
import { cors, runMiddleware } from '../cors';
import { prisma } from '@genus/db';
import { log } from 'next-axiom';
import { buffer } from 'micro';
import { Webhook, WebhookRequiredHeaders } from 'svix';
import { IncomingHttpHeaders } from 'http';
import { createNewUser, deleteUser, updateUser } from '~/server/handlers/clerk';
import type { WebhookEvent } from "@clerk/clerk-sdk-node"

// Disable the bodyParser so we can access the raw
// request body for verification.
export const config = {
    api: {
        bodyParser: false,
    },
};

const webhookSecret = String(process.env.CLERK_WEBHOOK_SECRET) || ""

export default async function handler(req: NextApiRequestWithSvixRequiredHeaders, res: NextApiResponse) {
    // Run the middleware
    await runMiddleware(req, res, cors);
    if (req.method === 'POST') {
        try {
            // Verify the webhook signature
            // See https://docs.svix.com/receiving/verifying-payloads/how
            // Validate the incoming data and return 400 if it's not what is expected
            const payload = (await buffer(req)).toString();
            log.info(payload);
            const headers = req.headers;
            const wh = new Webhook(webhookSecret);
            let event: WebhookEvent | null = null;
            event = wh.verify(payload, headers) as WebhookEvent;
            let data;
            // Handle the webhook
            switch (event.type) {
                case 'user.created':
                    data = { message: "User created", status: "SUCCESS", debug: true }
                    // data = await createNewUser({event, prisma})
                    break;
                case 'user.updated':
                    data = await updateUser({event, prisma})
                    break;
                case 'user.deleted':
                    data = await deleteUser({event, prisma})
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }
            return res.status(200).json({ received: true, message: `Webhook received!`,  data: data ?? undefined });
        } catch (error) {
            // Catch and log errors - return a 500 with a message
            console.error(error);
            // Sentry.captureException(error);
            return res.status(500).send({ message: 'Server error!' });
        }
    } else {
        res.setHeader('Allow', 'POST');
        return res.status(405).send({ message: 'Method not allowed.' });
    }
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
    headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};
