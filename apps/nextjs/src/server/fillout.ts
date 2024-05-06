import { nanoid } from "nanoid";
import type { z } from "zod";

import { company, db, eq } from "@genus/db";
import type { careerInterestsSchema } from "@genus/validators";
import { industrySchema } from "@genus/validators";
import { prettyPrint } from "@genus/validators/helpers";

import type { Submission } from "~/types/fillout";
import { labelEncode } from "~/utils";

const COMPANY_NAME_FIELD_ID = "pXSotdYMKF13MKwc2LfuMS";
const OTHER_COMPANY_NAME_FIELD_ID = "3t42iRkLQTk79ppuiGWCSz";
const INDUSTRY_FIELD_ID = "8G8mChQYfzjoCg4kgaiT3q";
const EXPERIENCE_TYPE_FIELD_ID = "dEnPiDw43Y5euYiNRg5shj";

type CompanyIndustry = z.infer<typeof careerInterestsSchema>;

export const INDUSTRY_DIVISION_MAP: Record<CompanyIndustry, string> = {
	banking_finance: "jRHpZ5d6PkgMdqctiC3QMq",
	law: "fyvzXUdjWfBL6mGBPfNV9W",
	consulting: "o1DZYA4QRpQf6QJiWqpGtQ",
	tech: ""
};

export const getCompanyAndIndustry = async (form: Submission) => {
	let name = null,
		dbCompany: (typeof company.$inferSelect)[] = [];
	const industry = form.questions.find(q => q.id === INDUSTRY_FIELD_ID)?.value as string;
	const industryLabel = labelEncode(industry, "category") as CompanyIndustry;

	const field = form.questions.find(q => q.id === COMPANY_NAME_FIELD_ID);
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

export const getWorkExperience = (form: Submission) => {
	const workExperience = form.questions.find(q => q.id === EXPERIENCE_TYPE_FIELD_ID);
	if (!workExperience) return null;
	return workExperience.value as string;
};
