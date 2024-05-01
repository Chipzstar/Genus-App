import type { NextApiRequest, NextApiResponse } from "next/types";
import { Resend } from "resend";

import { ReferralEmail } from "@genus/email";
import { referralEmailSchema } from "@genus/validators";

import { env } from "~/env";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { RESEND_SENDER_EMAIL, REVIEW_FORM_URL } = env;
	try {
		const payload = await referralEmailSchema.safeParseAsync(req.body);

		if (!payload.success) {
			return res.status(400).json(payload.error);
		}

		const { recipients, subject, referrerName, referrerEmail } = payload.data;

		const { data, error } = await resend.emails.send({
			from: `Genus <${RESEND_SENDER_EMAIL}>`,
			to: recipients,
			subject,
			react: ReferralEmail({ formUrl: REVIEW_FORM_URL }),
			reply_to: referrerEmail,
			text: `Hey, ${referrerName} wants you to fill out a review form for Genus. Here's the link\n\n${REVIEW_FORM_URL}`
		});

		if (error) {
			console.log(error);
			return res.status(400).json(error);
		}
		console.log(data);
		res.status(200).json(data);
	} catch (err) {
		console.error(err);
	}
}
