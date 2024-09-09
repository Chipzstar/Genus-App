import type { ChangeEvent, ReactElement } from "react";
import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { ChevronRight } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";

import { appRouter, createContextInner } from "@genus/api";
import { transformer } from "@genus/api/transformer";
import { Card, CardContent } from "@genus/ui/card";

import { BackButton } from "~/components/BackButton";
import SearchFilterPanel from "~/components/SearchFilterPanel";
import AppLayout from "~/layout/AppLayout";
import TopNav from "~/layout/TopNav";
import { PATHS } from "~/utils";
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
	const [categories, setCategories] = useState<string[]>([]);
	const router = useRouter();
	const { data } = trpc.resource.getResources.useQuery(undefined, {
		onSuccess: data => {
			setCategories([...new Set(data.flatMap(r => r.tags))].slice(0, 10));
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

	const filterResources = useCallback(
		(key: string) => {
			setResources(data?.filter(r => r.tags.includes(key)) ?? []);
		},
		[data]
	);

	return (
		<div className="page-container overflow-y-hidden">
			<TopNav />
			<div className="flex h-full flex-col p-6 sm:px-12 sm:pt-12">
				<div className="mx-auto  w-full max-w-3xl">
					<nav className="flex grow items-center justify-between">
						<section className="flex items-center space-x-4 md:space-x-8">
							<BackButton />
							<header className="text-2xl font-bold text-black sm:text-4xl">Recommend</header>
						</section>
						<Link href={PATHS.CREATE_RESOURCE}>
							<span className="text-base font-bold text-primary underline sm:text-2xl">Create Post</span>
						</Link>
					</nav>
					<SearchFilterPanel
						value={search}
						onChange={handleChange}
						categories={categories}
						filterValues={filterResources}
					/>
					<div className="genus-scrollbar flex max-h-120 flex-col space-y-3 overflow-y-scroll text-black sm:pr-2">
						{debouncedResources.map((resource, index) => (
							<Card
								key={index}
								role="button"
								className="transition-colors hover:bg-accent"
								onClick={() => {
									void router.push(`${PATHS.RECOMMEND}/${resource.resourceId}`);
								}}
							>
								<CardContent className="flex items-center justify-between p-4">
									<div className="flex flex-col space-y-2">
										<span className="text-xl font-bold capitalize tracking-tight sm:text-2xl">
											{resource.name}
										</span>
										<span className="text-dark text-lg font-semibold italic">
											Posted by {resource.author.firstname}
										</span>
										<div className="flex flex-wrap">
											{resource.tags.map((tag, tagIndex) => (
												<span
													key={tagIndex}
													className="mb-1 mr-2 inline-block rounded-sm bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600"
												>
													#{tag}
												</span>
											))}
										</div>
									</div>
									<ChevronRight className="h-6 w-6 text-muted-foreground" />
								</CardContent>
							</Card>
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
