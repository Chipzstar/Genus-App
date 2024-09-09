import type { PropsWithChildren } from "react";
import React from "react";
import { useRouter } from "next/router";
import { cx } from "class-variance-authority";

import ChatwootWidget from "~/components/ChatwootWidget";
import { env } from "~/env";
import BottomNav from "~/layout/BottomNav";
import { fontSans } from "~/layout/Layout";

const { NEXT_PUBLIC_CHATWOOT_TOKEN } = env;

interface Props {
	userId?: string;
}

const AppLayout = ({ children }: PropsWithChildren<Props>) => {
	const router = useRouter();

	return (
		<>
			<ChatwootWidget token={NEXT_PUBLIC_CHATWOOT_TOKEN} />
			<main
				className={cx(
					"m-auto min-h-screen overflow-y-hidden bg-gradient-to-r from-primary to-secondary-300",
					fontSans.className
				)}
			>
				{children}
				<BottomNav activePage={router.pathname} />
			</main>
		</>
	);
};

export default AppLayout;
