import React, { useEffect } from "react";
import { Montserrat as FontSans } from "next/font/google";

import { AxiomWebVitals } from "next-axiom";

import { Toaster } from "@genus/ui/sonner";
import { usePostHog } from "posthog-js/react";
import { useClerk } from "@clerk/nextjs";
import Head from "next/head";

interface Props {
	children: React.ReactNode;
}

export const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });
const Layout = ({ children }: Props) => {
	const posthog = usePostHog()
	const { user } = useClerk()
	if (user) {
		const { id, emailAddresses, firstName, lastName } = user;
		// @ts-expect-error chatwootSDK.setUser
		window.$chatwoot.setUser(user.id, {
			email: user.emailAddresses[0]!.emailAddress,
			name: `${user.firstName} ${user.lastName}`,
			avatar_url: user.imageUrl || undefined
		});
		posthog.identify(
			id,  // Replace 'distinct_id' with your user's unique identifier
			{
				email: emailAddresses[0]!.emailAddress,
				name: `${firstName} ${lastName}`
			} // optional: set additional user properties
		);
	}
	return (
		<>
			<Head>
				<title>Genus Networks</title>
			</Head>
			<AxiomWebVitals />
			<main className={fontSans.className}>
				{children}
				<Toaster richColors />
			</main>
		</>
	);
};

export default Layout;
