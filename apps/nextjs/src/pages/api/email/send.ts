import type { NextApiRequest, NextApiResponse } from "next/types";
import { nanoid } from "nanoid";
import { log } from "next-axiom";
import { Resend } from "resend";

import { db, referral } from "@genus/db";
import { ReferralEmail } from "@genus/email";
import { referralEmailSchema } from "@genus/validators";
import { prettyPrint } from "@genus/validators/helpers";

import { env } from "~/env";

const resend = new Resend(process.env.RESEND_API_KEY);

type ReferralSchema = Pick<typeof referral.$inferInsert, "refereeEmail1" | "refereeEmail2" | "refereeEmail3">;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { RESEND_SENDER_EMAIL, REVIEW_FORM_URL } = env;
	try {
		const payload = await referralEmailSchema.safeParseAsync(req.body);

		if (!payload.success) {
			return res.status(400).json(payload.error);
		}

		const { submissionId, recipients, subject, referrerName, referrerEmail } = payload.data;

		const { data, error } = await resend.emails.send({
			from: `Genus <${RESEND_SENDER_EMAIL}>`,
			to: recipients,
			subject,
			react: ReferralEmail({ formUrl: REVIEW_FORM_URL, referrerName }),
			reply_to: referrerEmail,
			text: `Hey, ${referrerName} wants you to fill out a review form for Genus. Here's the link\n\n${REVIEW_FORM_URL}`
		});

		if (error) {
			console.log(error);
			return res.status(400).json(error);
		}

		if (data) log.info("Email status:", data);

		const refereeEmails: ReferralSchema = recipients.reduce(
			(prev, email, index) => {
				const key = `refereeEmail${index + 1}`;
				return {
					...prev,
					[key]: email
				};
			},
			{
				refereeEmail1: ""
			}
		);

		console.log(refereeEmails);

		const entry = await db.insert(referral).values({
			submissionId,
			referralId: `referral-REF${nanoid(12)}`,
			referrerName,
			referrerEmail,
			isActive: true,
			isDeleted: false,
			...refereeEmails
		});

		prettyPrint(entry);
		log.info(`Referral email sent to ${recipients.join(", ")}`);
		log.info(`Extra raffle entry for ${referrerEmail}`, entry);
		// res.status(200).json({});
		res.status(200).json(data);
	} catch (err) {
		console.error(err);
	}
}
