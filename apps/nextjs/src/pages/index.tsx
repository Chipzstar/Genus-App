import type { ReactElement } from "react";
import React from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { useClerk } from "@clerk/nextjs";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { Image, Listbox, ListboxItem } from "@nextui-org/react";
import { createServerSideHelpers } from "@trpc/react-query/server";

import { appRouter, createContextInner } from "@genus/api";
import { transformer } from "@genus/api/transformer";
import { Button } from "@genus/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@genus/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@genus/ui/tabs";
import type { Industry } from "@genus/validators";
import { career_interests } from "@genus/validators/constants";

import CompanyCard from "~/components/CompanyCard";
import ResourceCard from "~/components/ResourceCard";
import TopTipCard from "~/components/TopTipCard";
import AppLayout from "~/layout/AppLayout";
import TopNav from "~/layout/TopNav";
import { formatString, PATHS } from "~/utils";
import { trpc } from "~/utils/trpc";

const TAB_CATEGORIES: { label: string; value: Industry }[] = [
	{
		label: "Banking & finance",
		value: "banking_finance"
	},
	{
		label: "Law",
		value: "law"
	},
	{
		label: "Consulting",
		value: "consulting"
	},
	{
		label: "Other",
		value: "other"
	}
];

export const getServerSideProps: GetServerSideProps = async ctx => {
	const { req } = ctx;
	const { userId } = getAuth(req);

	if (!userId) {
		return {
			props: {}
		};
	}

	const helpers = createServerSideHelpers({
		router: appRouter,
		transformer,
		ctx: await createContextInner({
			auth: {
				userId
			}
		})
	});

	await helpers.review.getReviews.prefetch();
	await helpers.company.getReviewCompanies.prefetch();

	return {
		props: {
			userId,
			trpcState: helpers.dehydrate(),
			...buildClerkProps(req)
		}
	};
};

const Home = () => {
	const router = useRouter();
	const { user } = useClerk();
	const { data: companies } = trpc.company.getReviewCompanies.useQuery();
	const { data: reviews } = trpc.review.getReviews.useQuery();
	const { data: resources } = trpc.review.getResources.useQuery();

	return (
		<div className="scrollable-page-container">
			<TopNav />
			<div className="home-wrapper">
				<div className="mx-auto max-w-3xl">
					<header className="mb-4 text-center text-xl font-semibold text-black md:text-3xl">
						Welcome, {user?.firstName}!
					</header>
					<p className="text-balance text-center text-lg font-medium italic text-black md:text-xl">
						Hear what other students said about their roles...
					</p>
					<section className="pb-6 pt-12">
						<div className="flex flex-col space-y-4">
							<div className="flex items-center justify-between">
								<header className="text-xl font-semibold sm:text-2xl">Top ranked companies</header>
							</div>
							<div className="insights-scrollable-container genus-scrollbar auto-cols-fr grid-cols-2 gap-x-4 sm:grid-cols-4">
								{companies?.map(({ logoUrl, slug, name, category }, index) => (
									<div
										key={index}
										className="inline-flex flex-col justify-between"
										role="button"
										onClick={() => router.push(`${PATHS.COMPANIES}/${slug}`)}
									>
										<div className="flex grow items-center justify-start">
											<Image
												src={logoUrl ?? "/images/spring-weeks-ldn.svg"}
												alt={name}
												className="overflow-hidden rounded-2xl"
												height={100}
												width={120}
											/>
										</div>

										<div className="flex flex-col text-black">
											<span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold md:text-base">
												{name}
											</span>
											<span className="text-ellipsis whitespace-nowrap text-xs font-medium md:text-sm">
												{formatString(category, "category")}
											</span>
										</div>
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
									<CarouselContent>
										{companies?.map(({ logoUrl, slug, name, category }, index) => (
											<CarouselItem
												key={index}
												onClick={() => router.push(`${PATHS.COMPANIES}/${slug}`)}
												className="flex flex-col items-center space-y-3 overflow-hidden pl-2"
											>
												{logoUrl && (
													<img
														src={logoUrl}
														alt={name}
														style={{
															objectFit: "contain"
														}}
														width={125}
														height={50}
													/>
												)}
												<div className="flex flex-col items-center text-gray-800">
													<span className="overflow-hidden text-ellipsis px-3 text-xs font-semibold">
														{name}
													</span>
													<span className="text-ellipsis whitespace-nowrap text-xs font-medium md:text-sm">
														{formatString(category, "category")}
													</span>
												</div>
											</CarouselItem>
										))}
									</CarouselContent>
									<CarouselNext />
								</Carousel>
							</div>
						</div>
					</section>

					<section className="h-full overflow-y-scroll pt-6 md:pt-12">
						<div className="mb-4 flex flex-col" role="button">
							<header className="text-xl font-semibold sm:text-2xl">
								<span>Companies</span>
							</header>
						</div>
						<div className="flex flex-col">
							<Tabs defaultValue="banking_finance" className="relative mb-3 w-full">
								<TabsList variant="outline" className="w-full">
									{TAB_CATEGORIES.map((tab, index) => (
										<TabsTrigger variant="outline" key={index} value={tab.value} className="grow">
											<span className="text-xs md:text-base">{tab.label}</span>
										</TabsTrigger>
									))}
								</TabsList>
								{TAB_CATEGORIES.map((tab, index) => (
									<TabsContent key={index} value={tab.value}>
										{companies
											?.filter(({ category }) => category === tab.value)
											.map((company, index) => (
												<CompanyCard
													key={index}
													onClick={() => router.push(`${PATHS.COMPANIES}/${company.slug}`)}
													company={company}
													reviews={company.reviews}
												/>
											))}
									</TabsContent>
								))}
							</Tabs>
							<div className="flex w-full items-center justify-center">
								<Button variant="ghost" size="lg" onClick={() => router.push(PATHS.COMPANIES)}>
									<span className="text-base sm:text-xl">See all companies</span>
								</Button>
							</div>
						</div>
					</section>
					<section className="h-full overflow-y-scroll pt-6 md:pt-12">
						<div className="mb-4 flex flex-col" role="button">
							<header className="text-xl font-semibold sm:text-2xl">
								<span>Top Resources</span>
							</header>
						</div>
						<div className="flex flex-col">
							<Tabs defaultValue="banking_finance" className="relative mb-3 w-full">
								<TabsList variant="outline" className="w-full">
									{TAB_CATEGORIES.map((tab, index) => (
										<TabsTrigger variant="outline" key={index} value={tab.value} className="grow">
											<span className="text-xs md:text-base">{tab.label}</span>
										</TabsTrigger>
									))}
								</TabsList>
								{TAB_CATEGORIES.map((tab, index) => {
									const map = resources?.grouped.get(tab.value);
									if (!map || map.size === 0) {
										return (
											<TabsContent key={index} value={tab.value}>
												<span className="text-sm text-primary sm:text-base">
													No resources found
												</span>
											</TabsContent>
										);
									}
									const values = Array.from(map.keys());
									return (
										<TabsContent key={index} value={tab.value}>
											{values.slice(0, 5).map((resource, index) => (
												<ResourceCard
													key={index}
													text={resource}
													count={map.get(resource) ?? 0}
													total={values.length}
												/>
											))}
										</TabsContent>
									);
								})}
							</Tabs>
							<div className="flex w-full items-center justify-center">
								<Button variant="ghost" size="lg" onClick={() => router.push(PATHS.RESOURCES)}>
									<span className="text-base sm:text-xl">See all top resources</span>
								</Button>
							</div>
						</div>
					</section>
					<section className="h-full overflow-y-scroll pt-6 md:pt-12">
						<div className="mb-4 flex flex-col" role="button">
							<header className="text-xl font-semibold sm:text-2xl">
								<span>Top Tips</span>
							</header>
						</div>
						<div className="sm:px-6">
							<Listbox
								aria-label="Actions"
								items={reviews?.filter(review => review.topTip)}
								onAction={slug => router.push(`${PATHS.COMPANIES}/${slug}`)}
							>
								{review => (
									<ListboxItem key={review.companyId} className="px-0 py-0">
										<TopTipCard
											hideBlockQuote
											id={review.reviewId}
											content={review.topTip}
											company={review.companyName}
											experience={review.experienceType}
										/>
									</ListboxItem>
								)}
							</Listbox>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

Home.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default Home;
