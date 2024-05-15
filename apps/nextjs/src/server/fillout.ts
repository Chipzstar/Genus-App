import { getYear, parse } from "date-fns";
import { nanoid } from "nanoid";
import type { z } from "zod";

import { company, db, eq } from "@genus/db";
import type { careerInterestsSchema } from "@genus/validators";
import { industrySchema } from "@genus/validators";
import { prettyPrint } from "@genus/validators/helpers";

import type { RatingType, ReviewType, Submission } from "~/types/fillout";
import { labelEncode, sanitize } from "~/utils";

const REVIEW_TYPE_FIELD_ID = "6XzkUL3dqz3ZaBiU9cXwCZ";
const COMPANY_NAME_FIELD_ID = "pXSotdYMKF13MKwc2LfuMS";
const OTHER_COMPANY_NAME_FIELD_ID = "3t42iRkLQTk79ppuiGWCSz";
const INDUSTRY_FIELD_ID = "8G8mChQYfzjoCg4kgaiT3q";
const EXPERIENCE_TYPE_FIELD_ID = "dEnPiDw43Y5euYiNRg5shj";
export const INDUSTRY_DIVISION_MAP: Record<CompanyIndustry, string> = {
	banking_finance: "jRHpZ5d6PkgMdqctiC3QMq",
	law: "fyvzXUdjWfBL6mGBPfNV9W",
	consulting: "o1DZYA4QRpQf6QJiWqpGtQ",
	tech: ""
};

export const getReviewType = (form: Submission) => {
	const reviewType = form.questions.find(q => q.id === REVIEW_TYPE_FIELD_ID)?.value as ReviewType;
	prettyPrint(reviewType, "#");
	return reviewType;
};

type CompanyIndustry = z.infer<typeof careerInterestsSchema>;

export const getCompanyAndIndustry = async (form: Submission) => {
	let name = null,
		dbCompany: (typeof company.$inferSelect)[] = [];
	const industry = form.questions.find(q => q.id === INDUSTRY_FIELD_ID)?.value as string;
	const industryLabel = labelEncode(industry, "category") as CompanyIndustry;
	const field = form.questions.find(q => q.id === COMPANY_NAME_FIELD_ID);
	console.log({ industry, industryLabel, field });

	if (!field) return { companyId: null, companyName: name, industry };
	const answer = field.value;

	if (answer === "Other") {
		const field = form.questions.find(q => q.id === OTHER_COMPANY_NAME_FIELD_ID);
		if (!field) return { companyId: null, companyName: name, industry };
		name = field.value as string;
	} else {
		name = answer as string;
	}

	if (!name) return { companyId: null, companyName: name, industry };
	dbCompany = await db.select().from(company).where(eq(company.name, name));
	if (!dbCompany.length) {
		// encode the industry field
		dbCompany = await db
			.insert(company)
			.values({
				companyId: `company_${nanoid(18)}`,
				name,
				slug: labelEncode(name),
				category: industryLabel
			})
			.returning();
	}
	prettyPrint(dbCompany);
	return {
		companyId: dbCompany[0]!.companyId,
		companyName: dbCompany[0]!.name,
		industry: industrySchema.catch("other").parse(industryLabel)
	};
};

export const getDivision = (form: Submission) => {
	// get industry field
	const industry = form.questions.find(q => q.id === INDUSTRY_FIELD_ID);
	if (!industry?.value) return null;
	const industryLabel = labelEncode(industry.value as string, "category");
	let divisionFieldId = "";
	// use the industry choice id to lookup the correct divisionFieldId from the INDUSTRY_OPTIONS_MAP
	if (industryLabel in INDUSTRY_DIVISION_MAP) {
		divisionFieldId = INDUSTRY_DIVISION_MAP[industryLabel as CompanyIndustry];
	}
	const division = form.questions.find(q => q.id === divisionFieldId);
	if (!division?.value) return null;
	return labelEncode(division.value as string);
};

export const getWorkExperience = (form: Submission) => {
	const workExperience = form.questions.find(q => q.id === EXPERIENCE_TYPE_FIELD_ID);
	if (!workExperience) return null;
	return workExperience.value as string;
};

/**
 * RATING FIELD IDS
 */
const OVERALL_RATING_FIELDS = ["pnaSu1Txa7VuqdExPZwHsx", "6n1BJqFrbnCC6AgdxCCjXa", "fWZBVfnPRFNnY8r8e9ouGH"];
const INTERVIEW_PROCESS_RATING_FIELDS = ["uDnqJtFFY2ungT6A2JaMSE", "6Ucwx84ufEVCxYU8k5XbFJ", "a1mfqMcNAowHCFKVeLGSFf"];
const DIVERSITY_RATING_FIELDS = ["qQX9K7jXkyQeQ7LHMT5pDa", "f365avhaQGLFxpqWY6ZogN"];
const TEAM_CULTURE_RATING_FIELDS = ["d7WdPQuiT69AWQ2atQgy7E", "xdmngf8vWkLcThbhnhxFuS"];
const APPLICATION_PROCESS_RATING_FIELDS = [
	"rkL4WyoKYSzfEkxp6r67Z5",
	"588gtPKKhPNJQ7eQ2cDbZM",
	"1GhHMgJCeLybRDezZ7L4Nk"
];
const RECOMMENDATION_RATING_FIELDS = ["bdnFCmtQbTevLgwUhGwY6Y", "pUcy4PPnyg3Ldsc8HebC6X", "tGfvxEaJFP9Fcnh9opPDjr"];
const FLEXIBILITY_RATING_FIELDS = ["trCAzBfDqqQNVHd46i5Zdo", "ew1GxxRx39dvDxu5aFS46a"];
const AUTHENTICITY_RATING_FIELDS = ["wzmK8bh2shVjxoxnmWsNQf"];
const WORK_LIFE_BALANCE_RATING_FIELDS = ["x6VdWc3hfvPvFETDdyD4pR", "pXBamkrmVjAfqzRHC85pdd"];

export const getRating = (form: Submission, type: RatingType, percentage = false) => {
	function getValue(fields: string[]) {
		questions = form.questions.filter(q => fields.includes(q.id));
		if (!questions.length) return 0;
		answer = questions.find(q => q.value !== null);
		if (!answer) return 0;
		return percentage ? Number(answer.value) / 10 : Number(answer.value);
	}

	let rating = 0,
		answer = null,
		questions = [];

	switch (type) {
		case "overall":
			rating = getValue(OVERALL_RATING_FIELDS);
			break;
		case "interview-process":
			rating = getValue(INTERVIEW_PROCESS_RATING_FIELDS);
			break;
		case "diversity":
			rating = getValue(DIVERSITY_RATING_FIELDS);
			break;
		case "team-culture":
			rating = getValue(TEAM_CULTURE_RATING_FIELDS);
			break;
		case "application-process":
			rating = getValue(APPLICATION_PROCESS_RATING_FIELDS);
			break;
		case "recommendation":
			rating = getValue(RECOMMENDATION_RATING_FIELDS);
			break;
		case "flexibility":
			rating = getValue(FLEXIBILITY_RATING_FIELDS);
			break;
		case "authenticity":
			rating = getValue(AUTHENTICITY_RATING_FIELDS);
			break;
		case "work-life-balance":
			rating = getValue(WORK_LIFE_BALANCE_RATING_FIELDS);
			break;
		default:
			break;
	}
	return rating;
};

export const getRegion = (form: Submission) => {
	const region = form.questions.find(q => q.id === "e9xkikJZCrKySoiVRSFDAT");
	if (!region) return null;
	return region.value as string;
};

export const getCompletionYear = (form: Submission) => {
	const completionYear = form.questions.find(q => q.id === "aYGjAeLdqA2BaU2P9z3b2m");
	if (completionYear?.value) {
		const dateString = completionYear.value as string;
		const date = parse(dateString, "yyyy-MM-dd", new Date());
		const year = getYear(date);
		return year;
	}
	return null;
};

export const checkIsConverter = (form: Submission) => {
	const isConverter = form.questions.find(q => q.id === "gEqoQsmxdiH3RQRqYjJBxr");
	if (!isConverter) return false;
	return isConverter.value === "Yes";
};

export const getTopTip = (form: Submission) => {
	const topTip = form.questions.find(q => q.id === "oACTfp9xoW55T1fatzaC1W");
	if (!topTip || !topTip?.value) return "";
	return topTip.value as string;
};

export const getTopSkills = (form: Submission) => {
	const topSkills = form.questions.find(q => q.id === "voSmSck2VnBjbgRjiTDyav");
	if (!topSkills || topSkills.type !== "Checkboxes" || topSkills?.value === null) return [];
	return topSkills.value.map(skill => sanitize(skill));
};

export const getProsAndCons = (form: Submission) => {
	const prosQ = form.questions.find(q => q.id === "hMRc2J6DysrJBVmftMrFzR");
	const consQ = form.questions.find(q => q.id === "2aqg6HmV7x3TEiTEoiU6AF");
	let pros: string[] = [],
		cons: string[] = [];

	if (prosQ?.value && prosQ.type === "Checkboxes") {
		pros = prosQ.value.map(pro => sanitize(pro));
	}
	if (consQ?.value && consQ.type === "Checkboxes") {
		cons = consQ.value.map(con => sanitize(con));
	}
	return { pros, cons };
};

/**
 * RESOURCES FIELD IDS
 */
const TOP_RESOURCES_FIELDS = [
	"wBbLtaikXWTpUkvqYrrkjT",
	"hmnRQRcMHr64NxGohdwBBw",
	"cK7fwRf5AwjmMxnw59xF5n",
	"kUPEdDwFC2tb8rLsxxWGTU"
];
export const getTopResources = (form: Submission) => {
	const resources: string[] = [];
	const resourceQuestions = form.questions.filter(q => TOP_RESOURCES_FIELDS.includes(q.id));
	for (const q of resourceQuestions) {
		if (q.value === null) continue;
		resources.push(q.value as string);
	}
	return resources;
};

/**
 * INTERVIEW FIELD IDS
 */
const INTERVIEW_QUESTIONS_FIELDS = ["1YgSPQsomDw8XKdtmafamp", "4jjLfL1KYkkoToCA4bFNK3"];
export const getInterviewQuestions = (form: Submission) => {
	const result: string[] = [];
	const interviewQuestions = form.questions.filter(q => INTERVIEW_QUESTIONS_FIELDS.includes(q.id));
	for (const q of interviewQuestions) {
		if (q.value === null) continue;
		result.push(sanitize(q.value as string));
	}
	return result;
};
