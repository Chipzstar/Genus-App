import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	shared: {
		NODE_ENV: z.enum(["development", "production", "test"]).default("development")
	},
	/**
	 * Specify your server-side environment variables schema here.
	 * This way you can ensure the app isn't built with invalid env vars.
	 */
	server: {
		AXIOM_DATASET: z.string(),
		AXIOM_TOKEN: z.string(),
		AXIOM_ORG_ID: z.string(),
		DB_ADMIN_USERNAME: z.string(),
		DB_ADMIN_PASSWORD: z.string(),
		DB_USERNAME: z.string(),
		DB_PASSWORD: z.string(),
		DB_HOST: z.string(),
		DB_NAME: z.string(),
		PORT: z.string().optional(),
		NODE_ENV: z.enum(["development", "test", "production"]),
		CLERK_SECRET_KEY: z.string(),
		CLERK_WEBHOOK_SECRET: z.string(),
		FILLOUT_WEBHOOK_SECRET: z.string(),
		FILLOUT_FORM_ID: z.string(),
		UPLOADTHING_APP_ID: z.string(),
		UPLOADTHING_SECRET: z.string(),
		UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
		UPSTASH_REDIS_REST_URL: z.string().optional(),
		POSTHOG_API_TOKEN: z.string(),
		RESEND_API_KEY: z.string(),
		RESEND_SENDER_EMAIL: z.string(),
		REVIEW_FORM_URL: z.string(),
		SANITY_API_READ_TOKEN: z.string(),
		TYPEFORM_WEBHOOK_SECRET: z.string()
	},

	/**
	 * Specify your client-side environment variables schema here.
	 * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
	 */
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
		NEXT_PUBLIC_AXIOM_DATASET: z.string(),
		NEXT_PUBLIC_AXIOM_TOKEN: z.string(),
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
		NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string(),
		NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string(),
		NEXT_PUBLIC_DEFAULT_GROUP_SLUG: z.string(),
		NEXT_PUBLIC_CHATWOOT_TOKEN: z.string(),
		NEXT_PUBLIC_POSTHOG_HOST: z.string(),
		NEXT_PUBLIC_POSTHOG_KEY: z.string(),
		NEXT_PUBLIC_SANITY_DATASET: z.string(),
		NEXT_PUBLIC_SANITY_PROJECT_ID: z.string(),
		NEXT_PUBLIC_SUPPORT_ADMIN_USER: z.string()
	},
	/**
	 * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
	 */
	experimental__runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		NEXT_PUBLIC_AXIOM_DATASET: process.env.NEXT_PUBLIC_AXIOM_DATASET,
		NEXT_PUBLIC_AXIOM_TOKEN: process.env.NEXT_PUBLIC_AXIOM_TOKEN,
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
		NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
		NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
		NEXT_PUBLIC_DEFAULT_GROUP_SLUG: process.env.NEXT_PUBLIC_DEFAULT_GROUP_SLUG,
		NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
		NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
		NEXT_PUBLIC_CHATWOOT_TOKEN: process.env.NEXT_PUBLIC_CHATWOOT_TOKEN,
		NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
		NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
		NEXT_PUBLIC_SUPPORT_ADMIN_USER: process.env.NEXT_PUBLIC_SUPPORT_ADMIN_USER
	},
	skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION || process.env.npm_lifecycle_event === "lint"
});
