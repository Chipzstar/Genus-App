import type { PropsWithChildren } from "react";
import React from "react";
import { useRouter } from "next/router";
import { MagicBellProvider } from "@magicbell/magicbell-react";
import { cx } from "class-variance-authority";

import ChatwootWidget from "~/components/ChatwootWidget";
import { env } from "~/env";
import BottomNav from "~/layout/BottomNav";
import { fontSans } from "~/layout/Layout";

const { NEXT_PUBLIC_MAGICBELL_API_KEY, NEXT_PUBLIC_CHATWOOT_TOKEN } = env;

interface Props {
	userId?: string;
}

const AppLayout = ({ children, userId }: PropsWithChildren<Props>) => {
	const router = useRouter();

	return (
		<MagicBellProvider
			apiKey={NEXT_PUBLIC_MAGICBELL_API_KEY}
			userExternalId={userId}
			userEmail={undefined}
			// userKey={user?.externalId ?? "H+paQwTZOCGQVumXJ4bnQj5wY9O0bnEfJoqSNP69zKM="}
			stores={[
				{ id: "default", defaultQueryParams: {} },
				{ id: "unread", defaultQueryParams: { read: false } }
			]}
		>
			<ChatwootWidget token={NEXT_PUBLIC_CHATWOOT_TOKEN} />
			<main
				className={cx(
					"m-auto min-h-screen overflow-y-hidden bg-gradient-to-r from-primary to-secondary-300 text-white",
					fontSans.className
				)}
			>
				{children}
				<BottomNav activePage={router.pathname} />
			</main>
		</MagicBellProvider>
	);
};

export default AppLayout;
