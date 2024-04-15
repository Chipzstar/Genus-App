import type { NextApiRequest, NextApiResponse } from "next/types";

import { prettyPrint } from "@genus/validators/helpers";

import { cors, runMiddleware } from "~/pages/api/cors";
import { utapi } from "~/server/uploadthing";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		try {
			await runMiddleware(req, res, cors);
			const results = await utapi.listFiles({});
			for (const result of results) {
				prettyPrint(result);
			}
			res.status(400).json({ results });
		} catch (error) {
			console.error(error);
			res.status(500).send({ error: error, message: "Server error!" });
		}
	} else {
		res.setHeader("Allow", "GET");
		res.status(405).send({ message: "Method not allowed." });
	}
}
