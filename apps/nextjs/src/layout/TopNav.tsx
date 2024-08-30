import type { FC } from "react";
import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";
import type { NavbarSlots, SlotsToClasses } from "@nextui-org/react";
import { Navbar, NavbarBrand } from "@nextui-org/react";
import { usePostHog } from "posthog-js/react";

import { PATHS } from "~/utils";

interface Props {
	classNames?: SlotsToClasses<NavbarSlots>;
}

const TopNav: FC<Props> = ({ classNames = {} }: Props) => {
	const router = useRouter();
	const { signOut } = useAuth();
	const posthog = usePostHog();
	return (
		<Navbar
			classNames={{
				base: "mb-4",
				...classNames
			}}
		>
			<NavbarBrand role="button" onClick={() => router.push(PATHS.HOME)}>
				<img
					src="/images/arc2.0-banner.png"
					alt="genus-white"
					className="mx-auto"
					style={{
						objectFit: "contain"
					}}
					width={100}
				/>
				<div className="absolute right-4">
					<img src="/images/powered-by-genus.png" alt="powered-by-genus" width={150} />
				</div>
			</NavbarBrand>
		</Navbar>
	);
};

export default TopNav;
