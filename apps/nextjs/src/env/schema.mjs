// @ts-check
import {z} from 'zod'

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
		DIRECT_DATABASE_URL: z.string().optional(),
		NODE_ENV: z.enum(['development', 'test', 'production']),
		CLERK_SECRET_KEY: z.string().optional(),
		CLERK_WEBHOOK_SECRET: z.string().optional(),
		UPLOADTHING_APP_ID: z.string().optional(),
		UPLOADTHING_SECRET: z.string().optional(),
		UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
		UPSTASH_REDIS_REST_URL: z.string().optional(),
		SANITY_API_READ_TOKEN: z.string().optional(),
		TRPC_BASE_URL: z.string().optional(),
})

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
		NEXT_PUBLIC_AXIOM_DATASET: z.string().optional(),
		NEXT_PUBLIC_AXIOM_TOKEN: z.string().optional(),
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().optional(),
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().optional(),
		NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().optional(),
		NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().optional(),
		NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
		NEXT_PUBLIC_SANITY_DATASET: z.string().optional()
})

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		NEXT_PUBLIC_AXIOM_DATASET: process.env.NEXT_PUBLIC_AXIOM_DATASET,
		NEXT_PUBLIC_AXIOM_TOKEN: process.env.NEXT_PUBLIC_AXIOM_TOKEN,
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
		NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
		NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
		NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
		NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET
}
