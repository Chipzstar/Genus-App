import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { SignedIn, useClerk } from "@clerk/nextjs";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { Navbar, NavbarBrand } from "@nextui-org/react";

import { Button } from "@genus/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@genus/ui/carousel";

import AppLayout from "~/layout/AppLayout";
import { getAllInsights, getClient } from "~/lib/sanity.client";
import { urlForImage } from "~/lib/sanity.image";
import { PATHS } from "~/utils";
import { trpc } from "~/utils/trpc";
import type { InsightPanel } from "~/utils/types";

interface PageProps {
	insights: InsightPanel[];
}

type Query = Record<string, string>;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const { req } = ctx;
	const { userId } = getAuth(req);
	const client = getClient();
	const insights = await getAllInsights(client);

	if (!insights || !userId) {
		return {
			props: {
				insights: []
			}
		};
	}

	const formattedInsights: InsightPanel[] = insights.map(({ slug, title, mainImage }) => ({
		slug,
		title,
		image: urlForImage(mainImage).height(100).width(150).url()
	}));

	return {
		props: {
			insights: formattedInsights,
			userId,
			...buildClerkProps(req)
		}
	};
};

const Home = (props: PageProps) => {
	const result = trpc.group.getGroupBySlug.useQuery({
		slug: "interngen-spring-into-banking-event"
	});
	const router = useRouter();
	const { signOut, user } = useClerk();

	return (
		<div className="page-container h-screen">
			<Navbar
				classNames={{
					brand: "w-full flex justify-center items-center"
				}}
			>
				<NavbarBrand role="button" onClick={() => router.push(PATHS.HOME)}>
					{/*<Image src={whiteLogo} quality={100} priority alt="genus-white" width={100} height={75} />*/}
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
			<div className="h-full flex-col bg-white p-6 sm:px-12 sm:pt-12">
				<div className="mx-auto max-w-3xl">
					<header className="text-center text-xl font-semibold text-black md:text-3xl">
						Welcome, {user?.firstName} {user?.lastName}
					</header>
					<section className="pt-6 md:pt-12">
						<div
							className="flex flex-col items-center justify-center space-y-4"
							role="button"
							onClick={() => router.push(`${PATHS.GROUPS}/interngen-spring-into-banking-event`)}
						>
							<header className="text-xl font-semibold">
								<span className="underline">JOIN</span> the group!
							</header>
							<object
								className="mx-auto"
								type="image/svg+xml"
								data="/images/spring-weeks-ldn.svg"
								width={200}
								height={150}
							/>
							<span className="text-ellipsis text-center text-base font-semibold md:text-lg">
								InternGen: Spring into Banking
							</span>
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
							<div className="insights-scrollable-container genus-scrollbar auto-cols-fr grid-cols-2 gap-x-4 sm:grid-cols-4">
								{props.insights.map(({ image, slug, title }, index) => (
									<div
										key={index}
										className="inline-flex flex-col space-y-4"
										role="button"
										onClick={() => router.push(`${PATHS.INSIGHTS}/${slug}`)}
									>
										<object
											className="mx-auto h-auto"
											type="image/svg+xml"
											data={image}
											width={175}
										/>
										{/*<img src={image} alt={title} className="" />*/}
										<span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold md:text-base">
											{title}
										</span>
									</div>
								))}
							</div>
							<div className="flex justify-center sm:hidden">
								<Carousel
									className="flex w-5/6 justify-center"
									opts={{
										align: "start",
										loop: true
									}}
								>
									<CarouselPrevious />
									<CarouselContent className="md:-ml-4">
										{props.insights.map(({ image, slug, title }, index) => (
											<CarouselItem
												key={index}
												onClick={() => router.push(`${PATHS.INSIGHTS}/${slug}`)}
												className="flex flex-col items-center space-y-3 pl-2 md:pl-4"
											>
												<object
													className="h-auto"
													type="image/svg+xml"
													data={image}
													width={175}
												/>
												{/*<Image src={image} alt={title} className="" width={175} height={50} />*/}
												<span className="overflow-hidden text-ellipsis px-3 text-center text-xs font-semibold">
													{title}
												</span>
											</CarouselItem>
										))}
									</CarouselContent>
									<CarouselNext />
								</Carousel>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

Home.getLayout = function getLayout(page: ReactElement, props: { userId: string }) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default Home;
