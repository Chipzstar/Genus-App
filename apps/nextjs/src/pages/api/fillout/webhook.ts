import { promises as fs } from "node:fs";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { buffer } from "micro";

import { env } from "~/env";
import { cors, runMiddleware } from "~/pages/api/cors";
import { getCompanyAndIndustry, getWorkExperience } from "~/server/fillout";
import type { FormEvent } from "~/types/fillout";

const { NODE_ENV, FILLOUT_WEBHOOK_SECRET, FILLOUT_FORM_ID } = env;

const secret = FILLOUT_WEBHOOK_SECRET;

async function writeToFile(data: any) {
	const submissionId = data.submission.submissionId as string;
	const filePath = `${process.cwd()}/.thing/hooks/fillout/submissions/${submissionId}.json`;
	await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

const verifySignature = (sig: string | string[] | undefined) => {
	if (NODE_ENV === "development") return true;
	const base64Secret = btoa(secret);
	return base64Secret === sig;
};

async function handleFormResponse(event: FormEvent) {
	if (NODE_ENV === "development") await writeToFile(event);
	const { companyName, companyId, industry } = await getCompanyAndIndustry(event.submission);
	const experienceType = getWorkExperience(event.submission);
	return {
		companyName,
		companyId,
		experienceType,
		industry
	};
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		// Run the middleware
		await runMiddleware(req, res, cors);
		const payload = (await buffer(req)).toString();
		const event = JSON.parse(payload) as FormEvent;
		const signature = req.headers["fillout-signature"];
		const isValid = verifySignature(signature);
		if (!isValid) {
			return res.status(400).json({ received: true, message: `Webhook received`, error: "Invalid signature" });
		}
		let data;
		// Handle the webhook
		switch (event.formId) {
			case FILLOUT_FORM_ID:
				data = await handleFormResponse(event);
				break;
			default:
				break;
		}

		return res.status(200).json({ received: true, message: `Webhook received`, data });
	} catch (err: any) {
		console.error(err);
		return res.status(400).json({ received: true, message: `Webhook received`, error: err.message });
	}
}

export const config = {
	api: {
		bodyParser: false
	}
};
