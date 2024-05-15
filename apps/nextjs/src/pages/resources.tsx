import type { ChangeEvent, ReactElement } from "react";
import React, { useCallback, useState } from "react";
import type { GetServerSideProps } from "next/types";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { useDebounceValue } from "usehooks-ts";

import { appRouter, createContextInner } from "@genus/api";
import { transformer } from "@genus/api/transformer";
import { career_interests } from "@genus/validators/constants";

import SearchFilterPanel from "~/components/SearchFilterPanel";
import AppLayout from "~/layout/AppLayout";
import TopNav from "~/layout/TopNav";
import { trpc } from "~/utils/trpc";

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

	await helpers.review.getResources.prefetch();

	return {
		props: {
			userId,
			trpcState: helpers.dehydrate(),
			...buildClerkProps(req)
		}
	};
};

const Resources = () => {
	const [search, setSearch] = useState("");
	const { data } = trpc.review.getResources.useQuery();
	const [resources, setResources] = useState<string[]>(data?.all ?? []);
	const [debouncedResources] = useDebounceValue<string[]>(resources, 500);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
			setResources(
				prev =>
					data?.all.filter(r => {
						return r.toLowerCase().includes(event.target.value.toLowerCase());
					}) ?? prev
			);
		},
		[data]
	);

	return (
		<div className="page-container overflow-y-hidden">
			<TopNav />
			<div className="flex h-full flex-col bg-white p-6 sm:px-12 sm:pt-12">
				<div className="mx-auto max-w-3xl">
					<header className="text-2xl font-bold text-black sm:text-4xl">Resources</header>
					<SearchFilterPanel value={search} onChange={handleChange} categories={career_interests} />
					<div className="genus-scrollbar flex max-h-120 flex-col overflow-y-scroll text-black">
						{debouncedResources.map((resource, index) => (
							<div key={index} className="px-0 py-3">
								<span className="text-xl font-semibold capitalize tracking-tight">{resource}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

Resources.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default Resources;
