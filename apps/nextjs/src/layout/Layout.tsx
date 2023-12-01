import React from 'react';
import {Montserrat as FontSans} from 'next/font/google';
import Head from 'next/head';

interface Props {
    children: React.ReactNode
}

export const fontSans = FontSans({subsets: ['latin'], variable: '--font-sans'});
const Layout = ({children}: Props) => {
    return (
        <>
            <Head>
                <title>Genus Networks</title>
            </Head>

            <main className={fontSans.className}>
                {children}
            </main>
        </>
    );
};

export default Layout;
