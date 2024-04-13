// Disable the bodyParser, so we can access the raw
// request body for verification.
import crypto from "crypto";
import { promises as fs } from "node:fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { nanoid } from "nanoid";
import { log } from "next-axiom";

import { db, review, typeformWebhook } from "@genus/db";
import { prettyPrint } from "@genus/validators/helpers";

import { env } from "~/env";
import { cors, runMiddleware } from "~/pages/api/cors";
import {
	calculateRating,
	checkConverted,
	getCompany,
	getCompletionYear,
	getDivision,
	getExperienceType,
	getRegion
} from "~/server/typeform";
import type { TypeformWebhookPayload } from "~/types/typeform";

const { NODE_ENV, TYPEFORM_WEBHOOK_SECRET } = env;

async function writeToFile(event: TypeformWebhookPayload) {
	const filePath = `${process.cwd()}/.thing/hooks/example-payload.json`;
	await fs.writeFile(filePath, JSON.stringify(event, null, 2));
}

const verifySignature = function (receivedSignature: string | string[] | undefined, payload: string) {
	const hash = crypto.createHmac("sha256", TYPEFORM_WEBHOOK_SECRET).update(payload).digest("base64");
	return receivedSignature === `sha256=${hash}`;
};

export async function handleFormResponse(event: TypeformWebhookPayload) {
	try {
		if (NODE_ENV === "development") await writeToFile(event);
		await db
			.insert(typeformWebhook)
			.values({
				eventId: event.event_id,
				eventType: event.event_type,
				typeformId: event.form_response.form_id,
				title: event.form_response.definition.title,
				num_questions: event.form_response.definition.fields.length,
				num_answers: event.form_response.answers.length
			})
			.returning();
		const { companyName, companyId } = await getCompany(event.form_response);
		const experienceType = getExperienceType(event.form_response);
		const division = getDivision(event.form_response);
		const completionYear = getCompletionYear(event.form_response);
		const region = getRegion(event.form_response);
		const rating = calculateRating(event.form_response);
		const isConverter = checkConverted(event.form_response);
		// const { pros, cons } = getProsAndCons(event.form_response);
		console.table({ companyId, companyName, division, experienceType, completionYear, region, rating });
		if (companyId && region && rating && isConverter) {
			const dbReview = await db
				.insert(review)
				.values({
					reviewId: `review_R${nanoid(18)}`,
					companyName,
					companyId,
					experienceType,
					division,
					completionYear,
					region,
					isConverter,
					rating: rating.toFixed(2)
				})
				.returning();
			prettyPrint(dbReview[0]);
			return dbReview[0];
		}
		log.error("No company Id provided", { companyId, companyName });
		return { result: null };
	} catch (err) {
		console.error(err);
		return { result: null };
	}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		// Run the middleware
		await runMiddleware(req, res, cors);
		const requestBody = (await buffer(req)).toString();
		const signature = req.headers["typeform-signature"];
		const isValid = verifySignature(signature, requestBody);
		const event: TypeformWebhookPayload = JSON.parse(requestBody);
		let data;
		// Handle the webhook
		switch (event.event_type) {
			case "form_response":
				data = await handleFormResponse(event);
				break;
			default:
				break;
		}
		return res.status(200).json({ received: true, message: `Webhook received`, data: { isValid, ...data } });
	} catch (err) {
		console.error(err);
		return res.status(400).json({ received: true, message: `Webhook received`, error: err.message });
	}
}

export const config = {
	api: {
		bodyParser: false
	}
};
