import { nanoid } from "nanoid";
import type { z } from "zod";

import { company, db, eq } from "@genus/db";
import type { careerInterestsSchema } from "@genus/validators";
import { prettyPrint } from "@genus/validators/helpers";

import type { FormResponse, NumberType } from "~/types/typeform";
import { labelEncode } from "~/utils";

type Industry = z.infer<typeof careerInterestsSchema>;

type IndustryChoiceId = "fDKse3jQNE1r" | "r9xkcsWp1ew1" | "Q05ls959WNDQ" | "r5XUXEjDmdp4";

const COMPANY_NAME_FIELD_ID = "ZEQq3C2K8gPz";
const OTHER_COMPANY_NAME_FIELD_ID = "Fq3ZNvlIW4co";
const EXPERIENCE_TYPE_FIELD_ID = "SlCBuLn0rCmE";
const INDUSTRY_FIELD_ID = "7JB0DGtjMraj";
const TOP_TIP_FIELD_ID = "eXK07QSdTjCO";
const INDUSTRY_OPTIONS_MAP: Record<IndustryChoiceId, { label: Industry; divisionFieldId: string }> = {
	fDKse3jQNE1r: {
		label: "banking_finance",
		divisionFieldId: "fjfX6mO0hvUP"
	},
	r9xkcsWp1ew1: {
		label: "law",
		divisionFieldId: "5Y6VylbEnqsh"
	},
	Q05ls959WNDQ: {
		label: "consulting",
		divisionFieldId: "vOtG6uI29MrT"
	},
	r5XUXEjDmdp4: {
		label: "tech",
		divisionFieldId: ""
	}
};
const COMPLETION_YEAR_FIELD_ID = "UmrcanD5wUFQ";
const REGION_FIELD_ID = "pADAoljdawAu";
const RATING_FIELD_IDS = [
	"Y3A9fYmILXfX",
	"liymQSrVVhNY",
	"GFXPNfi3VN4W",
	"McGjQaGZyj3e",
	"2i1MEONS86JI",
	"8PT4TSMTimUf"
];
const IS_CONVERTER_FIELD_ID = "JujDUonW2zpe";

export const getCompany = async (form: FormResponse) => {
	let name = null;
	const field = form.definition.fields.find(
		field => field.title.includes("company") || field.id === COMPANY_NAME_FIELD_ID
	);
	if (!field) return { companyId: null, companyName: name };
	const answer = form.answers.find(answer => answer.field.id === COMPANY_NAME_FIELD_ID);
	if (!answer) return { companyId: null, companyName: name };
	if (answer.type === "choice") {
		name = answer.choice.label;
	}
	if (!name) return { companyId: null, companyName: name };
	let dbCompany = await db.select().from(company).where(eq(company.name, name));
	// If no company with the given name was found, or if the user selected "Other", create a new one in the database
	if (name === "Other") {
		// find the user's answer to the industry question
		const industry = form.answers.find(a => a.field.id === INDUSTRY_FIELD_ID);
		if (industry?.type !== "choice") return { companyId: null, companyName: name };
		const choiceId = industry.choice.id as IndustryChoiceId;
		const category = INDUSTRY_OPTIONS_MAP[choiceId].label;
		// find the user's answer to the "Enter your company Name question"
		const answer = form.answers.find(a => a.field.id === OTHER_COMPANY_NAME_FIELD_ID);
		if (answer?.type !== "text") return { companyId: null, companyName: name };
		dbCompany = await db
			.insert(company)
			.values({
				companyId: `company_${nanoid(18)}`,
				name: answer.text,
				slug: labelEncode(answer.text),
				category
			})
			.returning();
	}
	prettyPrint(dbCompany);
	return {
		companyId: dbCompany[0]!.companyId,
		companyName: dbCompany[0]!.name
	};
};

export const getDivision = (form: FormResponse) => {
	// get industry field
	const industry = form.answers.find(a => a.field.id === INDUSTRY_FIELD_ID);
	if (industry?.type !== "choice") return null;
	// use the industry choice id to lookup the correct divisionFieldId from the INDUSTRY_OPTIONS_MAP
	const choiceId = industry.choice.id as IndustryChoiceId;
	const divisionFieldId = INDUSTRY_OPTIONS_MAP[choiceId].divisionFieldId;
	const division = form.answers.find(a => a.field.id === divisionFieldId);
	if (division?.type !== "choice") return null;
	return division.choice.label;
};

export const getExperienceType = (form: FormResponse) => {
	const experienceType = form.answers.find(a => a.field.id === EXPERIENCE_TYPE_FIELD_ID);
	if (experienceType?.type !== "choice") return null;
	return experienceType.choice.label;
};

export const getCompletionYear = (form: FormResponse) => {
	const completionYear = form.answers.find(a => a.field.id === COMPLETION_YEAR_FIELD_ID);
	if (completionYear?.type !== "number") return null;
	return completionYear.number;
};

export const getRegion = (form: FormResponse) => {
	const region = form.answers.find(a => a.field.id === REGION_FIELD_ID);
	if (region?.type !== "choice") return null;
	return region.choice.label;
};

export const getTopTip = (form: FormResponse) => {
	const topTip = form.answers.find(a => a.field.id === TOP_TIP_FIELD_ID);
	if (topTip?.type !== "text") return "";
	return topTip.text;
};

export const calculateRating = (form: FormResponse) => {
	const ratings = form.answers.filter(
		a => RATING_FIELD_IDS.includes(a.field.id) && a.field.type === "rating"
	) as NumberType[];
	if (!ratings.length) return null;
	return ratings.map(r => r.number).reduce((a, b) => a + b, 0) / ratings.length;
};

export const checkConverted = (form: FormResponse) => {
	const isConverted = form.answers.find(a => a.field.id === IS_CONVERTER_FIELD_ID);
	if (isConverted?.type !== "boolean") return null;
	return isConverted.boolean;
};

export const getProsAndCons = (form: FormResponse) => {};
