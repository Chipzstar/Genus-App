// src/pages/_app.tsx
import "../styles/globals.css";

import { ReactElement, ReactNode, useEffect } from "react";
import type { InferGetServerSidePropsType, NextPage } from "next";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import { PagesProgressBar as ProgressBar } from "next-nprogress-bar";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import { FileProvider } from "~/context/FileContext";
import Layout from "~/layout/Layout";
import { trpc } from "~/utils/trpc";

if (typeof window !== "undefined") {
	// checks that we are client-side
	posthog.init(String(process.env.NEXT_PUBLIC_POSTHOG_KEY), {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
		loaded: posthog => {
			if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
		}
	});
}
export type NextPageWithAppLayout<P extends (args: unknown) => NonNullable<unknown>, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement, props: InferGetServerSidePropsType<P>) => ReactNode;
};

export type NextPageWithAuthLayout<P = NonNullable<unknown>, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithAuthLayout<any> | NextPageWithAppLayout<any>;
};

type AppTypeWithLayout = ({ Component, pageProps: { ...pageProps } }: AppPropsWithLayout) => any;

const MyApp: AppTypeWithLayout = ({ Component, pageProps: { ...pageProps } }: AppPropsWithLayout) => {
	const router = useRouter();

	useEffect(() => {
		// Track page views
		const handleRouteChange = () => posthog.capture("$pageview");
		router.events.on("routeChangeComplete", handleRouteChange);

		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, []);

	const getLayout = Component.getLayout ?? ((page: any) => page);
	return getLayout(
		<ClerkProvider {...pageProps} publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
			<PostHogProvider client={posthog}>
				<NextUIProvider>
					<FileProvider>
						<Layout>
							<ProgressBar height="4px" color="#fff" options={{ showSpinner: true }} shallowRouting />
							<Component {...pageProps} />
						</Layout>
					</FileProvider>
				</NextUIProvider>
			</PostHogProvider>
		</ClerkProvider>,
		pageProps
	);
};

export default trpc.withTRPC(MyApp);
