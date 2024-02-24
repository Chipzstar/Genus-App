// src/pages/_app.tsx
import "../styles/globals.css";

import type { ReactElement, ReactNode } from "react";
import type { InferGetServerSidePropsType, NextPage } from "next";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { NextUIProvider } from "@nextui-org/react";
import { PagesProgressBar as ProgressBar } from "next-nprogress-bar";

import { FileProvider } from "~/context/FileContext";
import Layout from "~/layout/Layout";
import { trpc } from "~/utils/trpc";

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
	const getLayout = Component.getLayout ?? ((page: any) => page);
	return getLayout(
		<ClerkProvider {...pageProps} publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
			<NextUIProvider>
				<FileProvider>
					<Layout>
						<ProgressBar height="4px" color="#fff" options={{ showSpinner: true }} shallowRouting />
						<Component {...pageProps} />
					</Layout>
				</FileProvider>
			</NextUIProvider>
		</ClerkProvider>,
		pageProps
	);
};

export default trpc.withTRPC(MyApp);
