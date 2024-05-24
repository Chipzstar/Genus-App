// src/db/seed.ts
import * as fs from "node:fs";
import { finished } from "stream/promises";
import { neon } from "@neondatabase/serverless";
import { parse } from "csv-parse";
import { drizzle } from "drizzle-orm/neon-http";
import { nanoid } from "nanoid";

import * as schema from "./drizzle/schemas/schema";
import { company, skillset, skillsetSlug } from "./drizzle/schemas/schema";

/**
 * Sanitizes a string by converting it to lowercase and replacing spaces with underscores.
 * @param str
 */
function labelEncode(str: string): string {
	return str
		.toLowerCase()
		.replace(/\s&\s/g, "_")
		.replace(/\s+/g, "_")
		.replace(/[^\w-]+/g, "")
		.replace(/--+/g, "_")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
}

function formatString(str: string, format: "default" | "category" = "default") {
	if (!str) return "";
	if (format === "category" && str === "banking_finance") return "Banking & Finance";
	if (str.length <= 2) return str.toUpperCase();
	return str
		.replace(/__/g, ", ") // replace two underscores with comma followed by a space
		.replace(/[_-]/g, " ") // replace underscore with a space
		.replace(/\b\w/g, l => l.toUpperCase()) // convert the first character of each word to uppercase
		.replace(/'(\w)/g, (_, letter) => "'" + letter.toLowerCase()); // handle special case for apostrophe
}

type Category = "law" | "banking_finance" | "consulting" | "tech";

interface CompanyRecord {
	id: number;
	name: string;
	slug: string;
	category: Category;
}

const processFile = async () => {
	const records: CompanyRecord[] = [];
	const parser = fs.createReadStream(`${process.cwd()}/companies.csv`).pipe(
		parse({
			// CSV options if any
		})
	);
	parser.on("readable", function () {
		let record;
		while ((record = parser.read()) !== null) {
			// Work with each record
			records.push({
				id: Number(record[0]),
				name: record[1],
				slug: labelEncode(record[1]),
				category: labelEncode(record[2]) as Category
			});
		}
	});
	await finished(parser);
	return records;
};

if (!("DATABASE_URL" in process.env)) throw new Error("DATABASE_URL not found on .env.development");

export const connectionString = [
	"postgresql://",
	process.env.DB_USERNAME,
	":",
	process.env.DB_PASSWORD,
	"@",
	process.env.DB_HOST,
	"/",
	process.env.DB_NAME,
	"?sslmode=require"
].join("");

const sql = neon(connectionString);
const db = drizzle(sql, { schema });

const insertCompanies = async () => {
	const companies = await processFile();
	const data: (typeof company.$inferInsert)[] = [];

	for (const c of companies) {
		data.push({
			id: c.id,
			companyId: `company_C${nanoid(18)}`,
			name: c.name,
			slug: c.slug,
			category: c.category,
			isDeleted: false
		});
	}
	console.log("Seed start");
	await db.insert(company).values(data);
};

const insertSkillsets = async () => {
	const data: (typeof skillset.$inferInsert)[] = [];

	skillsetSlug.enumValues.forEach((slug, idx) => {
		data.push({
			id: idx + 1,
			name: formatString(slug),
			slug
		});
	});
	console.log("Seed start");
	await db.insert(skillset).values(data);
};

const main = async (type: "company" | "skillset") => {
	try {
		if (type === "company") {
			await insertCompanies();
		} else {
			await insertSkillsets();
		}
	} catch (error) {
		console.error("Error during seeding:", error);

		process.exit(1);
	}
};

void main("skillset").then(r => console.log("Seed done"));
