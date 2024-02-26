import { WinstonTransport as AxiomTransport } from "@axiomhq/winston";
import winston from "winston";

const { combine, errors } = winston.format;

const axiomTransport = new AxiomTransport({
	dataset: process.env.AXIOM_DATASET!,
	token: process.env.AXIOM_TOKEN!,
	orgId: process.env.AXIOM_ORG_ID!
});

export const logger = winston.createLogger({
	level: process.env.AXIOM_LOG_LEVEL ?? "info",
	levels: {
		verbose: 0,
		debug: 1,
		info: 2,
		warn: 2,
		error: 4
	},
	format: combine(errors({ stack: true }), winston.format.json()),
	defaultMeta: { service: "user-service" },
	transports: [
		axiomTransport
		// You can pass an option here, if you don't the transport is configured automatically
		// using environment variables like `AXIOM_DATASET` and `AXIOM_TOKEN`
	]
});
