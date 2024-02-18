import type { PropsWithChildren } from "react";
import React from "react";
import { useRouter } from "next/router";
import { MagicBellProvider } from "@magicbell/magicbell-react";
import { cx } from "class-variance-authority";

import BottomNav from "~/components/BottomNav";
import { fontSans } from "~/layout/Layout";

const MAGICBELL_API_KEY = process.env.NEXT_PUBLIC_MAGICBELL_API_KEY!;

interface Props {
	userId?: string;
}

const AppLayout = ({ children, userId }: PropsWithChildren<Props>) => {
	const router = useRouter();
	return (
		<MagicBellProvider
			apiKey={MAGICBELL_API_KEY}
			userExternalId={userId}
			// userKey={user?.externalId ?? "H+paQwTZOCGQVumXJ4bnQj5wY9O0bnEfJoqSNP69zKM="}
			stores={[
				{ id: "default", defaultQueryParams: {} },
				{ id: "unread", defaultQueryParams: { read: false } }
			]}
		>
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
