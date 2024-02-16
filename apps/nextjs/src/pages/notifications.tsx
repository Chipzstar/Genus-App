import React, { ReactElement } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { SignedIn, useAuth } from "@clerk/nextjs";
import { Navbar, NavbarBrand } from "@nextui-org/react";

import { Button } from "@genus/ui/button";

import AppLayout from "~/layout/AppLayout";
import { PATHS } from "~/utils";

const Notifications = () => {
	const router = useRouter();
	const { signOut } = useAuth();
	return (
		<div className="page-container">
			<Navbar
				classNames={{
					brand: "w-full flex justify-center items-center"
				}}
			>
				<NavbarBrand role="button" onClick={() => router.push(PATHS.HOME)}>
					<object className="mx-auto" type="image/svg+xml" data="/images/logo-white.svg" width={100} />
					<div className="absolute right-4">
						<SignedIn>
							<Button size="sm" onClick={e => signOut()}>
								Logout
							</Button>
						</SignedIn>
					</div>
				</NavbarBrand>
			</Navbar>
			<div className="h-full bg-white p-6 sm:px-12 sm:pt-12"></div>
		</div>
	);
};

Notifications.getLayout = function getLayout(page: ReactElement) {
	return <AppLayout>{page}</AppLayout>;
};

export default Notifications;
