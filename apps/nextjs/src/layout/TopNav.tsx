import type { FC } from "react";
import React from "react";
import { useRouter } from "next/router";
import { SignedIn, useAuth } from "@clerk/nextjs";
import type { NavbarSlots, SlotsToClasses } from "@nextui-org/react";
import { Navbar, NavbarBrand } from "@nextui-org/react";
import { usePostHog } from "posthog-js/react";

import { Button } from "@genus/ui/button";

import { PATHS } from "~/utils";

interface Props {
	classNames?: SlotsToClasses<NavbarSlots>;
	imagePath?: string;
}

const TopNav: FC<Props> = ({ classNames = {}, imagePath = "/images/green-logo.png" }: Props) => {
	const router = useRouter();
	const { signOut } = useAuth();
	const posthog = usePostHog();
	return (
		<Navbar
			classNames={{
				brand: "w-full flex justify-center items-center",
				...classNames
			}}
		>
			<NavbarBrand role="button" onClick={() => router.push(PATHS.HOME)}>
				<img
					src={imagePath}
					alt="genus-white"
					className="mx-auto mb-1.5"
					style={{
						objectFit: "contain"
					}}
					width={100}
					height={61}
				/>
				<div className="absolute right-4">
					<SignedIn>
						<Button
							size="sm"
							onClick={e => {
								void signOut().then(() => posthog.reset());
							}}
						>
							Logout
						</Button>
					</SignedIn>
				</div>
			</NavbarBrand>
		</Navbar>
	);
};

export default TopNav;
