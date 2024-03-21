import React from "react";
import { Montserrat as FontSans } from "next/font/google";
import Head from "next/head";
import { useClerk } from "@clerk/nextjs";
import { AxiomWebVitals } from "next-axiom";
import { usePostHog } from "posthog-js/react";

import { Toaster } from "@genus/ui/sonner";

interface Props {
	children: React.ReactNode;
}

export const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });
const Layout = ({ children }: Props) => {
	const posthog = usePostHog()
	const { user } = useClerk()
	if (user) {
		const { id, emailAddresses, firstName, lastName } = user;
		posthog.identify(
			id,  // Replace 'distinct_id' with your user's unique identifier
			{
				email: emailAddresses[0]!.emailAddress,
				name: `${firstName} ${lastName}`
			} // optional: set additional user properties
		);
		if (typeof window !== "undefined" && window.$chatwoot) {
			// @ts-expect-error chatwootSDK.setUser
			(window as any).$chatwoot.setUser(user.id, {
				email: user.emailAddresses[0]!.emailAddress,
				name: `${user.firstName} ${user.lastName}`,
				avatar_url: user.imageUrl || undefined
			});
		}
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
