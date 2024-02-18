import React from "react";
import { Montserrat as FontSans } from "next/font/google";
import Head from "next/head";
import { AxiomWebVitals } from "next-axiom";

import { Toaster } from "@genus/ui/toaster";

interface Props {
	children: React.ReactNode;
}

export const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });
const Layout = ({ children }: Props) => {
	return (
		<>
			<Head>
				<title>Genus Networks</title>
			</Head>
			<AxiomWebVitals />
			<main className={fontSans.className}>
				{children}
				<Toaster />
			</main>
		</>
	);
};

export default Layout;
