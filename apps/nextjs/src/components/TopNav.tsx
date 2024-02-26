import React, { FC } from "react";
import { useRouter } from "next/router";
import { SignedIn, useAuth } from "@clerk/nextjs";
import { Navbar, NavbarBrand, NavbarSlots, SlotsToClasses } from "@nextui-org/react";
import { usePostHog } from "posthog-js/react";

import { Button } from "@genus/ui/button";

import { PATHS } from "~/utils";

interface Props {
	classNames?: SlotsToClasses<NavbarSlots>;
	imagePath?: string;
}

const TopNav: FC<Props> = ({ classNames = {}, imagePath = "/images/logo-white.svg" }: Props) => {
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
				<object className="mx-auto" type="image/svg+xml" data={imagePath} width={100} />
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
