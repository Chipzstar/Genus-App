import { PostHog } from "posthog-node";

const token = process.env.POSTHOG_API_TOKEN ?? "phc_DHoLHSbuMAmQBvSRudynrQD938Dno9NSBmpvNPBBnyk";

export const posthog = new PostHog(
	token,
	{ host: "https://eu.posthog.com", enable: process.env.NODE_ENV === "production" } // You can omit this line if using PostHog Cloud
);

await posthog.shutdownAsync(); // TIP: On program exit, call shutdown to stop pending pollers and flush any remaining events
