import type { ReactElement } from "react";
import React from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { useClerk } from "@clerk/nextjs";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { createServerSideHelpers } from "@trpc/react-query/server";

import { appRouter, createContextInner } from "@genus/api";
import { transformer } from "@genus/api/transformer";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@genus/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@genus/ui/tabs";
import { career_interests } from "@genus/validators/constants";

import CompanyCard from "~/components/CompanyCard";
import TopNav from "~/components/TopNav";
import AppLayout from "~/layout/AppLayout";
import { getAllCompanies, getAllInsights, getClient } from "~/lib/sanity.client";
import { urlForImage } from "~/lib/sanity.image";
import { PATHS } from "~/utils";
import { trpc } from "~/utils/trpc";
import type { CompanyPanel, InsightPanel } from "~/utils/types";

interface PageProps {
	insights: InsightPanel[];
	companies: CompanyPanel[];
}

const COMPANY_TABS = [
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
	}
];

export const getServerSideProps: GetServerSideProps = async ctx => {
	const { req } = ctx;
	const { userId } = getAuth(req);
	const client = getClient();
	const insights = await getAllInsights(client);
	const companies = await getAllCompanies(client);

	if (!userId) {
		return {
			props: {
				insights: [],
				companies: []
			}
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

	const formattedInsights: InsightPanel[] = insights.map(({ slug, title, mainImage }) => ({
		slug,
		title,
		image: urlForImage(mainImage).height(100).width(150).url()
	}));

	const formattedCompanies: CompanyPanel[] = companies.map(({ slug, title, mainImage, category }) => ({
		slug,
		title,
		image: urlForImage(mainImage).height(300).width(300).url(),
		category
	}));

	await helpers.review.getReviews.prefetch();

	return {
		props: {
			insights: formattedInsights,
			companies: formattedCompanies,
			userId,
			trpcState: helpers.dehydrate(),
			...buildClerkProps(req)
		}
	};
};

const Home = (props: PageProps) => {
	const router = useRouter();
	const { user } = useClerk();
	const { data: reviews } = trpc.review.getReviews.useQuery();
	return (
		<div className="scrollable-page-container">
			<TopNav />
			<div className="h-full flex-col bg-white p-6 sm:px-12 sm:pt-12">
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
								<header className="text-xl font-semibold">Top ranked companies</header>
							</div>
							<div className="insights-scrollable-container genus-scrollbar auto-cols-fr grid-cols-2 gap-x-4 sm:grid-cols-4">
								{props.companies.map(({ image, slug, title, category }, index) => (
									<div
										key={index}
										className="inline-flex flex-col"
										role="button"
										onClick={() => router.push(`${PATHS.INSIGHTS}/${slug}`)}
									>
										<img
											src={image}
											alt={slug}
											className="overflow-hidden rounded-2xl"
											style={{
												objectFit: "contain"
											}}
											width={150}
											height={100}
										/>
										<div className="flex flex-col text-black">
											<span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold md:text-base">
												{title}
											</span>
											<span className="text-ellipsis whitespace-nowrap text-xs font-medium md:text-sm">
												{category.title}
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
										{props.companies.map(({ image, slug, title, category }, index) => (
											<CarouselItem
												key={index}
												onClick={() => router.push(`${PATHS.COMPANIES}/${slug}`)}
												className="flex flex-col items-center space-y-3 overflow-hidden pl-2"
											>
												<img
													src={image}
													alt={title}
													style={{
														objectFit: "contain"
													}}
													width={125}
													height={50}
												/>
												<div className="flex flex-col items-center text-gray-800">
													<span className="overflow-hidden text-ellipsis px-3 text-xs font-semibold">
														{title}
													</span>
													<span className="text-ellipsis whitespace-nowrap text-xs font-medium md:text-sm">
														{category.title}
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
						<div className="flex flex-col space-y-4" role="button">
							<header className="text-xl font-semibold">
								<span>Companies</span>
							</header>
						</div>
						<div className="flex flex-col">
							<Tabs defaultValue="banking_finance" className="relative w-full">
								<TabsList variant="outline" className="w-full">
									{COMPANY_TABS.map((tab, index) => (
										<TabsTrigger variant="outline" key={index} value={tab.value} className="grow">
											<span className="text-xs md:text-base">{tab.label}</span>
										</TabsTrigger>
									))}
									<TabsTrigger variant="outline" key={900} value="other" className="grow">
										<span className="text-xs md:text-base">Other</span>
									</TabsTrigger>
								</TabsList>
								{COMPANY_TABS.map((tab, index) => (
									<TabsContent key={index} value={tab.value}>
										{props.companies
											.filter(({ category }) => category.slug.current === tab.value)
											.map((company, index) => (
												<CompanyCard
													key={index}
													onClick={() => router.push(`${PATHS.COMPANIES}/${company.slug}`)}
													company={company}
													numReviews={
														reviews?.filter(review => review.companyName === company.title)
															.length ?? 0
													}
												/>
											))}
									</TabsContent>
								))}
								<TabsContent value="other">
									{props.companies
										.filter(({ category }) => !(category.slug.current in career_interests))
										.map((company, index) => (
											<CompanyCard
												key={index}
												onClick={() => router.push(`${PATHS.COMPANIES}/${company.slug}`)}
												company={company}
												numReviews={
													reviews?.filter(review => review.companyName === company.title)
														.length ?? 0
												}
											/>
										))}
								</TabsContent>
							</Tabs>
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
