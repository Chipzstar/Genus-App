import { promises as fs } from "node:fs";
import type { NextApiRequest, NextApiResponse } from "next/types";
import { createInsertSchema } from "drizzle-zod";
import { buffer } from "micro";
import { log } from "next-axiom";
import { z } from "zod";

import { db, review } from "@genus/db";
import { prettyPrint } from "@genus/validators/helpers";

import { env } from "~/env";
import { cors, runMiddleware } from "~/pages/api/cors";
import {
	checkIsConverter,
	getCompanyAndIndustry,
	getCompletionYear,
	getDivision,
	getInterviewQuestions,
	getProsAndCons,
	getRating,
	getRegion,
	getReviewType,
	getTopResources,
	getTopSkills,
	getTopTip,
	getWorkExperience
} from "~/server/fillout";
import type { FormEvent } from "~/types/fillout";

const insertReviewSchema = createInsertSchema(review, {
	avgRating: z.number(),
	applicationProcess: z.number(),
	interviewProcess: z.number(),
	diversity: z.number(),
	flexibility: z.number(),
	teamCulture: z.number(),
	authenticity: z.number(),
	workLifeBalance: z.number(),
	recommendToFriend: z.number()
});

const { NODE_ENV, FILLOUT_WEBHOOK_SECRET: secret, FILLOUT_FORM_ID } = env;

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

	const reviewType = getReviewType(event.submission);
	if (reviewType === "Student") throw new Error("Form responses from students cannot be parsed");

	const { companyName, companyId, industry } = await getCompanyAndIndustry(event.submission);
	const division = getDivision(event.submission);
	const experienceType = getWorkExperience(event.submission);
	const interviewProcess = getRating(event.submission, "interview-process");
	const diversity = getRating(event.submission, "diversity");
	const teamCulture = getRating(event.submission, "team-culture");
	const applicationProcess = getRating(event.submission, "application-process");
	const recommendToFriend = getRating(event.submission, "recommendation");
	const flexibility = getRating(event.submission, "flexibility");
	const authenticity = getRating(event.submission, "authenticity", true);
	const workLifeBalance = getRating(event.submission, "work-life-balance");
	const avgRating = getRating(event.submission, "overall");
	const isConverter = checkIsConverter(event.submission);
	const region = getRegion(event.submission);
	const completionYear = getCompletionYear(event.submission);
	const { pros, cons } = getProsAndCons(event.submission);
	const topSkills = getTopSkills(event.submission);
	const topResources = getTopResources(event.submission);
	const interviewQuestions = getInterviewQuestions(event.submission);
	const topTip = getTopTip(event.submission);

	const payload = {
		reviewId: event.submission.submissionId,
		companyId,
		companyName,
		industry,
		experienceType,
		completionYear,
		division,
		applicationProcess,
		interviewProcess,
		avgRating,
		diversity,
		flexibility,
		workLifeBalance,
		teamCulture,
		recommendToFriend,
		authenticity,
		topTip,
		region,
		interviewQuestions,
		topResources,
		topSkills,
		pros,
		cons,
		isConverter
	};

	const parsedPayload = insertReviewSchema.safeParse(payload);

	// validate insert payload
	if (!parsedPayload.success) {
		log.error(parsedPayload.error.message);
		console.log(parsedPayload.error);
		return { result: null };
	}

	// insert new review record
	// @ts-ignore
	const dbReview = await db.insert(review).values(parsedPayload.data).returning();
	prettyPrint(dbReview[0]);
	return dbReview[0];
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
