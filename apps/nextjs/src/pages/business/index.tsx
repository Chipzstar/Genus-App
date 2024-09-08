import type { ChangeEvent, ReactElement } from "react";
import React, { useCallback, useState } from "react";
import type { GetServerSideProps } from "next";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { Link } from "@nextui-org/react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { useDebounceValue } from "usehooks-ts";

import { appRouter, createContextInner } from "@genus/api";
import { transformer } from "@genus/api/transformer";

import { BackButton } from "~/components/BackButton";
import { BusinessCard } from "~/components/BusinessCard";
import SearchFilterPanel from "~/components/SearchFilterPanel";
import AppLayout from "~/layout/AppLayout";
import TopNav from "~/layout/TopNav";
import { PATHS } from "~/utils";
import type { RouterOutputs } from "~/utils/trpc";
import { trpc } from "~/utils/trpc";

type Businesses = RouterOutputs["business"]["all"];

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

	await helpers.business.all.prefetch();

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
	const [categories, setCategories] = useState<string[]>([]);
	const { data } = trpc.business.all.useQuery(undefined, {
		onSuccess(data: Businesses) {
			setCategories([...new Set(data.flatMap(r => r.tags))].slice(0, 10));
			setBusinesses(data);
		}
	});
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

	const filterBusinesses = useCallback(
		(key: string) => {
			setBusinesses(data?.filter(r => r.tags.includes(key)) ?? []);
		},
		[data]
	);

	return (
		<div className="page-container overflow-y-hidden bg-white">
			<TopNav />
			<div className="flex h-full flex-col bg-white p-6 sm:px-12 sm:pt-12">
				<div className="mx-auto w-full max-w-3xl">
					<nav className="flex grow items-center justify-between">
						<section className="flex items-center space-x-4 md:space-x-8">
							<BackButton />
							<header className="text-xl font-bold text-black sm:text-2xl md:text-4xl">
								Business Directory
							</header>
						</section>
						<Link href={PATHS.CREATE_BUSINESS}>
							<span className="min-w-28 text-base font-bold text-primary underline sm:text-2xl">
								Create Post
							</span>
						</Link>
					</nav>
					<SearchFilterPanel
						value={search}
						onChange={handleChange}
						categories={categories}
						classNames="sm:w-full"
						filterValues={filterBusinesses}
					/>
					<div className="genus-scrollbar grid grid-cols-2 flex-col gap-4 overflow-y-scroll text-black sm:grid-cols-3 lg:grid-cols-4">
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
