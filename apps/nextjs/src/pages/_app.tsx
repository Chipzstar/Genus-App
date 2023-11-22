// src/pages/_app.tsx
import '../styles/globals.css';
import type { AppType } from 'next/app';
import { ClerkProvider } from '@clerk/nextjs';
import { trpc } from '../utils/trpc';
import { Montserrat as FontSans } from '@next/font/google';

export const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' });

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
    return (
        <ClerkProvider {...pageProps}>
            <main className={fontSans.className}>
                <Component {...pageProps} />
            </main>
        </ClerkProvider>
    );
};

export default trpc.withTRPC(MyApp);
