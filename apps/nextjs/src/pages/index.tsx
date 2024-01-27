import type { ReactElement } from "react";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { SignedIn, useClerk } from "@clerk/nextjs";
import { Navbar, NavbarBrand } from "@nextui-org/react";

import { Button } from "@genus/ui/button";

import AppLayout from "~/layout/AppLayout";
import { INSIGHTS, PATHS } from "~/utils";
import { trpc } from "~/utils/trpc";

const Home = () => {
	const {
		isLoading,
		data: group,
		failureReason,
		error
	} = trpc.group.getGroupBySlug.useQuery({
		slug: "pre-spring-week-chat"
	});
	const router = useRouter();
	const { signOut } = useClerk();

	return (
		<div className="page-container h-screen">
			<Navbar
				classNames={{
					brand: "w-full flex justify-center items-center"
				}}
			>
				<NavbarBrand role="button" onClick={() => router.push(PATHS.HOME)}>
					<Image
						src="/images/logo-white.svg"
						quality={100}
						priority
						alt="genus-white"
						width={100}
						height={75}
					/>
					<div className="absolute right-4">
						<SignedIn>
							<Button size="sm" onClick={e => signOut()}>
								Logout
							</Button>
						</SignedIn>
					</div>
				</NavbarBrand>
			</Navbar>
			<div className="h-full bg-white p-6 sm:px-12 sm:pt-12">
				<header className="text-3xl font-semibold">Home: Finance & Banking</header>
				<section className="pt-12">
					<div
						className="flex flex-col justify-center space-y-4"
						role="button"
						onClick={() => router.push(PATHS.GROUPS)}
					>
						<header className="text-xl font-semibold">JOIN the group!</header>
						<Image
							src="/images/spring-weeks-ldn.svg"
							alt="Spring Weeks London"
							width={200}
							height={150}
							objectFit=""
						/>
						<span className="text-lg font-semibold">Spring Weeks LDN...</span>
					</div>
				</section>
				<section className="h-full pb-6 pt-12">
					<div className="flex flex-col space-y-4">
						<div className="flex items-center justify-between">
							<header className="text-xl font-semibold">Industry insights</header>
							<span
								role="button"
								onClick={() => router.push(PATHS.INSIGHTS)}
								className="text-sm font-semibold"
							>
								See all
							</span>
						</div>
						<div className="grid-limited auto-cols-fr grid-cols-2 gap-x-4 sm:grid-cols-4 lg:gap-x-8">
							{INSIGHTS.map(({ image, id, title }, index) => (
								<div
									key={index}
									className="inline-flex flex-col space-y-4"
									role="button"
									onClick={() => router.push(`${PATHS.INSIGHTS}/${id}`)}
								>
									<img src={image} alt={title} />
									<span className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold">
										{title}
									</span>
								</div>
							))}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

Home.getLayout = function getLayout(page: ReactElement) {
	return <AppLayout>{page}</AppLayout>;
};

export default Home;
