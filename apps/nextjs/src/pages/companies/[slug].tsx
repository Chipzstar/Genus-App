import React from "react";
import type { ReactElement } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { Image } from "@nextui-org/react";
import { createServerSideHelpers } from "@trpc/react-query/server";

import { appRouter, createContextInner } from "@genus/api";
import { transformer } from "@genus/api/transformer";
import { Alert, AlertDescription, AlertTitle } from "@genus/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@genus/ui/tabs";

import CompanyOverview from "~/components/CompanyOverview";
import Loader from "~/components/Loader";
import TopTipCard from "~/components/TopTipCard";
import AppLayout from "~/layout/AppLayout";
import TopNav from "~/layout/TopNav";
import { formatString } from "~/utils";
import { trpc } from "~/utils/trpc";

const REVIEW_TABS = [
	{
		label: "Top tips",
		value: "top_tips"
	},
	{
		label: "Interview Questions",
		value: "interview_questions"
	},
	{
		label: "All reviews",
		value: "all_reviews"
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

	ctx.params && (await helpers.company.getCompanyBySlug.prefetch({ slug: ctx.params.slug as string }));

	return {
		props: {
			userId,
			trpcState: helpers.dehydrate(),
			...buildClerkProps(req)
		}
	};
};

const CompanySlug = () => {
	const router = useRouter();
	const slug = router.query.slug as string;
	const {
		isLoading,
		data: company,
		failureReason,
		error
	} = trpc.company.getCompanyBySlug.useQuery(
		{
			slug
		},
		{
			onSuccess: res => {
				console.log(res);
			}
		}
	);

	return (
		<div className="scrollable-page-container overflow-y-hidden">
			<TopNav />
			<div className="flex h-full flex-col bg-white text-black">
				<div className="mx-auto max-w-xl">
					<Image
						src="/images/launch-screen.png"
						alt="backdrop-image"
						removeWrapper
						classNames={{
							img: "w-full"
						}}
					/>
					{isLoading ? (
						<Loader />
					) : company ? (
						<section className="flex h-full flex-col sm:px-4">
							<div className="-mb-12 flex w-full justify-center">
								<Image
									className="border-gray bottom-16 overflow-hidden rounded-3xl border-2 bg-white shadow-sm"
									src={company.logoUrl}
									alt="backdrop-image"
									width={125}
								/>
							</div>
							<div className="flex flex-col pb-5">
								<h2 className="text-center text-xl font-semibold sm:text-3xl">{company.name}</h2>
								<p className="text-center font-semibold italic tracking-tight text-primary sm:text-lg">
									{formatString(company.category, "category")}
								</p>
							</div>
							<CompanyOverview reviews={company.reviews} />
							<div className="flex flex-col py-5">
								<Tabs defaultValue="top_tips" className="relative mb-3 w-full max-w-3xl">
									<TabsList variant="outline" className="w-full">
										{REVIEW_TABS.map((tab, index) => (
											<TabsTrigger
												variant="outline"
												key={index}
												value={tab.value}
												className="grow"
											>
												<span className="text-xs md:text-base">{tab.label}</span>
											</TabsTrigger>
										))}
									</TabsList>
									<TabsContent key={1} value="top_tips" className="max-w-3xl">
										{company.reviews.map(r => (
											<div key={r.id} className="flex px-4">
												<TopTipCard
													id={r.reviewId}
													company={company.name}
													content={r.topTip}
													experience={r.experienceType}
													hideBlockQuote
												/>
											</div>
										))}
									</TabsContent>
								</Tabs>
							</div>
						</section>
					) : (
						<div className="flex h-full flex-col justify-center p-6 sm:px-12">
							<Alert variant="destructive" className="text-center">
								<AlertTitle>Company does not exist!</AlertTitle>
								<AlertDescription>
									{failureReason
										? failureReason.message
										: error
											? error?.message
											: "Please check you are using the right URL"}
								</AlertDescription>
							</Alert>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

CompanySlug.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default CompanySlug;
