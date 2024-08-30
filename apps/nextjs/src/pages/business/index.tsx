import type { ChangeEvent, ReactElement } from "react";
import React, { useCallback, useState } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { useDebounceValue } from "usehooks-ts";

import { appRouter, createContextInner } from "@genus/api";
import { transformer } from "@genus/api/transformer";
import { career_interests } from "@genus/validators/constants";

import { BackButton } from "~/components/BackButton";
import { BusinessCard } from "~/components/BusinessCard";
import SearchFilterPanel from "~/components/SearchFilterPanel";
import AppLayout from "~/layout/AppLayout";
import TopNav from "~/layout/TopNav";
import { PATHS } from "~/utils";
import type { RouterOutputs } from "~/utils/trpc";
import { trpc } from "~/utils/trpc";

type Businesses = RouterOutputs["business"]["getAll"];

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

	await helpers.business.getAll.prefetch();

	return {
		props: {
			userId,
			trpcState: helpers.dehydrate(),
			...buildClerkProps(req)
		}
	};
};

const BusinessDirectory = () => {
	const [search, setSearch] = useState("");
	const { data } = trpc.business.getAll.useQuery();
	const [businesses, setBusinesses] = useState<Businesses>(data ?? []);
	const [debouncedBusinesses] = useDebounceValue<Businesses>(businesses, 500);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
			setBusinesses(
				prev =>
					data?.filter(r => {
						return r.name.toLowerCase().includes(event.target.value.toLowerCase());
					}) ?? prev
			);
		},
		[data]
	);

	return (
		<div className="page-container overflow-y-hidden bg-white">
			<TopNav />
			<div className="flex h-full flex-col bg-white p-6 sm:px-12 sm:pt-12">
				<div className="mx-auto w-full max-w-3xl">
					<nav className="flex grow items-center justify-between">
						<section className="flex items-center space-x-4">
							<BackButton />
							<header className="text-xl font-bold text-black sm:text-2xl md:text-4xl">
								Business Directory
							</header>
						</section>
						<Link href={PATHS.CREATE_BUSINESS}>
							<span className="text-base font-bold text-primary underline sm:text-2xl">Create Post</span>
						</Link>
					</nav>
					<SearchFilterPanel
						value={search}
						onChange={handleChange}
						categories={career_interests}
						classNames="sm:w-full"
					/>
					<div className="genus-scrollbar grid grid-cols-2 flex-col gap-x-4 overflow-y-scroll text-black sm:grid-cols-3 lg:grid-cols-4">
						{debouncedBusinesses.map((business, index) => (
							<BusinessCard key={index} business={business} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

BusinessDirectory.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default BusinessDirectory;
