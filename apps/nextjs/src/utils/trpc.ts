// src/utils/trpc.ts
import * as process from "process";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@genus/api";
import { transformer } from "@genus/api/transformer";

import { env } from "~/env";

const { NODE_ENV } = env;

const getBaseUrl = () => {
	if (typeof window !== "undefined") return ""; // browser should use relative url
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
	return `http://localhost:3002`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
	config(opts) {
		const { ctx } = opts;
		if (typeof window !== "undefined") {
			// during client requests
			return {
				transformer,
				links: [
					loggerLink({
						enabled: opts =>
							NODE_ENV === "development" || (opts.direction === "down" && opts.result instanceof Error)
					}),
					httpBatchLink({
						url: `/api/trpc`
					})
				]
			};
		}
		return {
			transformer, // optional - adds superjson serialization
			links: [
				httpBatchLink({
					// The server needs to know your app's full url
					url: `${getBaseUrl()}/api/trpc`,
					/**
					 * Set custom request headers on every request from tRPC
					 * @link https://trpc.io/docs/v10/header
					 */
					headers() {
						if (!ctx?.req?.headers) {
							return {};
						}
						// To use SSR properly, you need to forward client headers to the server
						// This is, so you can pass through things like cookies when we're server-side rendering
						return {
							cookie: ctx.req.headers.cookie
						};
					}
				})
			]
		};
	},
	ssr: false
});

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
