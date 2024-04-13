// src/db/seed.ts
import * as fs from "node:fs";
import { finished } from "stream/promises";
import { neon } from "@neondatabase/serverless";
import { parse } from "csv-parse";
import { drizzle } from "drizzle-orm/neon-http";
import { nanoid } from "nanoid";

import schema, { company } from "./drizzle/schema";

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

const main = async () => {
	try {
		const companies = await processFile();
		const data: (typeof company.$inferInsert)[] = [];

		for (const c of companies) {
			data.push({
				id: c.id,
				companyId: `company_${nanoid(18)}`,
				name: c.name,
				slug: c.slug,
				category: c.category,
				isDeleted: false
			});
		}
		console.log("Seed start");
		await db.insert(company).values(data);
	} catch (error) {
		console.error("Error during seeding:", error);

		process.exit(1);
	}
};

void main().then(r => console.log("Seed done"));
