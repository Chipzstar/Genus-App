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
import type { RouterOutputs } from "~/utils/trpc";
import { trpc } from "~/utils/trpc";

type Resources = RouterOutputs["resource"]["getResources"];

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

	await helpers.resource.getResources.prefetch();

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
	const { data } = trpc.resource.getResources.useQuery(undefined, {
		onSuccess: data => {
			setResources(data);
		}
	});
	const [resources, setResources] = useState<Resources>(data ?? []);
	const [debouncedResources] = useDebounceValue<Resources>(resources, 500);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
			setResources(
				prev =>
					data?.filter(r => {
						return r.name.toLowerCase().includes(event.target.value.toLowerCase());
					}) ?? prev
			);
		},
		[data]
	);

	return (
		<div className="church-container overflow-y-hidden py-6 md:py-8">
			<TopNav />
			<div className="flex h-full flex-col bg-white p-6 sm:px-12 sm:pt-12">
				<div className="mx-auto max-w-3xl">
					<header className="text-2xl font-bold text-black sm:text-4xl">Resources</header>
					<SearchFilterPanel value={search} onChange={handleChange} categories={career_interests} />
					<div className="genus-scrollbar flex max-h-120 flex-col overflow-y-scroll text-black">
						{debouncedResources.map((resource, index) => (
							<div key={index} className="flex flex-col space-y-1 px-0 py-3">
								<span className="text-xl font-bold capitalize tracking-tight sm:text-2xl">
									{resource.name}
								</span>
								<span className="text-dark text-lg font-semibold italic">
									Posted by {resource.author.firstname}
								</span>
								<div className="flex flex-wrap space-x-2">
									{resource.tags.map((tag, index) => (
										<span
											key={index}
											className="inline-block rounded-sm bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600"
										>
											#{tag}
										</span>
									))}
								</div>
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
