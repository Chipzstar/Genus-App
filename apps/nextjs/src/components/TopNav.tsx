import React, { FC } from 'react';
import { PATHS } from "~/utils";
import { Button } from "@genus/ui/button";
import { Navbar, NavbarBrand, NavbarSlots, SlotsToClasses } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { SignedIn, useAuth } from '@clerk/nextjs';
import { usePostHog } from 'posthog-js/react';

interface Props {
	classNames?: SlotsToClasses<NavbarSlots>
}

const TopNav: FC<Props> = ({classNames={}}: Props) => {
	const router = useRouter();
	const { signOut } = useAuth();
	const posthog = usePostHog()
	return (
		<Navbar
			classNames={{
				brand: "w-full flex justify-center items-center",
				...classNames
			}}
		>
			<NavbarBrand role="button" onClick={() => router.push(PATHS.HOME)}>
				<object className="mx-auto" type="image/svg+xml" data="/images/logo-white.svg" width={100} />
				<div className="absolute right-4">
					<SignedIn>
						<Button size="sm" onClick={e => {
							signOut().then(() => posthog.reset())
						}}>
							Logout
						</Button>
					</SignedIn>
				</div>
			</NavbarBrand>
		</Navbar>
	);
};

export default TopNav;
