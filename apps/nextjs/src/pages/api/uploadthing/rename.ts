import type { NextApiRequest, NextApiResponse } from "next/types";
import { UTApi } from "uploadthing/server";

import { cors, runMiddleware } from "~/pages/api/cors";

const utapi = new UTApi();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		try {
			await runMiddleware(req, res, cors);

			const { key } = req.body;
			const result = await utapi.renameFiles({
				key,
				newName: "company/hsbc.webp",
				customId: "hsbc"
			});
			if (result.success) {
				console.log(result);
				res.status(200).json(result);
			}
			res.status(400).json({ error: result });
		} catch (error) {
			console.error(error);
			res.status(500).send({ error: error, message: "Server error!" });
		}
	} else {
		res.setHeader("Allow", "POST");
		res.status(405).send({ message: "Method not allowed." });
	}
}
