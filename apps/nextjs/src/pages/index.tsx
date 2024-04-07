import type { ReactElement } from "react";
import React from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { useClerk } from "@clerk/nextjs";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@genus/ui/carousel";

import TopNav from "~/components/TopNav";
import { env } from "~/env";
import AppLayout from "~/layout/AppLayout";
import { getAllInsights, getClient } from "~/lib/sanity.client";
import { urlForImage } from "~/lib/sanity.image";
import { PATHS } from "~/utils";
import type { InsightPanel } from "~/utils/types";

interface PageProps {
	insights: InsightPanel[];
}

const { NEXT_PUBLIC_DEFAULT_GROUP_SLUG } = env;

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

	// insights.forEach(({mainImage}) => console.log(urlForImage(mainImage).url()))

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
	const router = useRouter();
	const { user } = useClerk();

	return (
		<div className="page-container h-screen">
			<TopNav />
			<div className="h-full flex-col bg-white p-6 sm:px-12 sm:pt-12">
				<div className="mx-auto max-w-3xl">
					<header className="text-center text-xl font-semibold text-black md:text-3xl">
						Welcome, {user?.firstName} {user?.lastName}
					</header>
					<section className="pt-6 md:pt-12">
						<div
							className="flex flex-col items-center justify-center space-y-4"
							role="button"
							onClick={() => router.push(`${PATHS.GROUPS}/${NEXT_PUBLIC_DEFAULT_GROUP_SLUG}`)}
						>
							<header className="text-xl font-semibold">
								<span className="underline">JOIN</span> the group!
							</header>
							<img
								src="/images/spring-weeks-ldn.svg"
								alt="spring-weeks-ldn"
								className="mx-auto overflow-visible"
								style={{
									objectFit: "contain"
								}}
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
										<img
											src={image}
											alt={slug}
											className="mx-auto overflow-visible"
											style={{
												objectFit: "contain"
											}}
											width={175}
											height={126}
										/>
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
												<img
													src={image}
													alt={title}
													style={{
														objectFit: "contain"
													}}
													width={175}
													height={50}
												/>
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
