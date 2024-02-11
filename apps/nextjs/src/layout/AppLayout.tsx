import React from "react";
import { useRouter } from "next/router";
import { cx } from "class-variance-authority";

import BottomNav from "~/components/BottomNav";
import { fontSans } from "~/layout/Layout";

interface Props {
	children: React.ReactNode;
}

const AppLayout = ({ children }: Props) => {
	const router = useRouter();
	return (
		<main
			className={cx(
				"m-auto min-h-screen overflow-y-hidden bg-gradient-to-r from-primary to-secondary-300 text-white",
				fontSans.className
			)}
		>
			{children}
			<BottomNav activePage={router.pathname} />
		</main>
	);
};

export default AppLayout;
