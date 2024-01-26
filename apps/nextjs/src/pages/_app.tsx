// src/pages/_app.tsx
import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {ClerkProvider} from '@clerk/nextjs';
import {trpc} from '~/utils/trpc';
import type {ReactElement, ReactNode} from "react";
import type {NextPage} from 'next';
import Layout from "~/layout/Layout";
import {NextUIProvider} from '@nextui-org/react';
import {ToastProvider} from "@genus/ui/toast";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

type AppTypeWithLayout = ({Component, pageProps: {...pageProps}}: AppPropsWithLayout) => any

const MyApp: AppTypeWithLayout = ({Component, pageProps: {...pageProps}}: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? ((page) => page)
    return getLayout(
        <ClerkProvider {...pageProps} publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <NextUIProvider>
                <ToastProvider swipeDirection="right" duration={3000}>
                    <Layout>
                        <Component {...pageProps} />
								<ProgressBar
								  height="4px"
								  color="#fff"
								  options={{ showSpinner: false }}
								  shallowRouting
								/>
                    </Layout>
                </ToastProvider>
            </NextUIProvider>
        </ClerkProvider>
    )
};

export default trpc.withTRPC(MyApp);
