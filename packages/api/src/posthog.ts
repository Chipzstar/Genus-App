import { PostHog } from "posthog-node";

const token = process.env.POSTHOG_API_TOKEN!;

export const posthog = new PostHog(
	token,
	{ host: "https://eu.i.posthog.com", disabled: process.env.NODE_ENV !== "production" } // You can omit this line if using PostHog Cloud
);

await posthog.shutdown(); // TIP: On program exit, call shutdown to stop pending pollers and flush any remaining events
