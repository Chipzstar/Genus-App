"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, ReactElement } from "react";
import type { GetStaticProps } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SignedIn, useAuth } from "@clerk/nextjs";
import { Listbox, ListboxItem, Navbar, NavbarBrand } from "@nextui-org/react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { useDebounceValue } from "usehooks-ts";

import { appRouter } from "@genus/api";
import { createContextInner } from "@genus/api/src/context";
import { transformer } from "@genus/api/transformer";
import { Button } from "@genus/ui/button";
import { Input } from "@genus/ui/input";
import { ScrollArea } from "@genus/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@genus/ui/select";
import { career_interests } from "@genus/validators/constants";

import InsightCard from "~/components/InsightCard";
import AppLayout from "~/layout/AppLayout";
import { getAllGroups, getClient } from "~/lib/sanity.client";
import { urlForImage } from "~/lib/sanity.image";
import { formatString, PATHS } from "~/utils";
import { trpc } from "~/utils/trpc";
import type { GroupPanel } from "~/utils/types";

interface PageProps {
	groups: GroupPanel[];
}

type Query = Record<string, string>;

export const getStaticProps: GetStaticProps<PageProps, Query> = async () => {
	const helpers = createServerSideHelpers({
		router: appRouter,
		transformer,
		ctx: await createContextInner({ auth: null })
	});
	await helpers.group.getGroups.prefetch();

	const client = getClient();
	const groups = await getAllGroups(client);

	if (!groups) {
		return {
			notFound: true
		};
	}

	const formattedGroups: GroupPanel[] = groups.map(({ slug, title, mainImage }) => ({
		slug,
		title,
		image: urlForImage(mainImage).height(100).width(150).url()
	}));
	return {
		props: {
			trpcState: helpers.dehydrate(),
			groups: formattedGroups
		}
	};
};

const Groups = (props: PageProps) => {
	const { signOut } = useAuth();
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [groups, setGroups] = useState<GroupPanel[]>(props.groups);
	const [debouncedGroups] = useDebounceValue<GroupPanel[]>(groups, 500);

	const {
		isLoading,
		data: allGroups,
		failureReason,
		error
	} = trpc.group.getGroups.useQuery(undefined, {
		onSuccess(data) {
			console.log(data);
		}
	});

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
			setGroups(() => props.groups.filter(g => g.title.toLowerCase().includes(event.target.value.toLowerCase())));
		},
		[props.groups]
	);

	return (
		<div className="page-container overflow-y-hidden bg-white">
			<Navbar
				classNames={{
					brand: "w-full flex justify-center items-center"
				}}
			>
				<NavbarBrand role="button" onClick={() => router.push(PATHS.HOME)}>
					<Image src="/images/green-logo.svg" alt="genus-white" width={100} height={75} />
					<div className="absolute right-4">
						<SignedIn>
							<Button size="sm" onClick={e => signOut()}>
								Logout
							</Button>
						</SignedIn>
					</div>
				</NavbarBrand>
			</Navbar>
			<div className="flex h-full flex-col p-6 sm:px-12 sm:pt-12">
				<div className="mx-auto max-w-3xl">
					<header className="text-2xl font-bold text-black sm:text-4xl">Groups</header>
					<div className="flex items-center justify-between space-x-10 py-6">
						<div className="flex sm:w-64">
							<Input
								value={search}
								onChange={handleChange}
								className="w-full rounded-3xl bg-neutral-100 font-semibold text-black placeholder:text-neutral-400"
								placeholder="Search"
							/>
						</div>
						<div className="flex sm:w-64">
							<Select>
								<SelectTrigger className="rounded-3xl bg-neutral-100 font-semibold text-black">
									<SelectValue defaultValue="all" placeholder="All types" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="all">All group types</SelectItem>
										{career_interests.map((item, index) => (
											<SelectItem key={index} value={item}>
												{formatString(item)}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>
					<ScrollArea className={"h-[calc(100%-2rem)]"}>
						<Listbox aria-label="Actions" onAction={slug => router.push(`${PATHS.GROUPS}/${slug}`)}>
							{debouncedGroups?.map(group => (
								<ListboxItem key={group.slug} className="px-0" textValue={group.title}>
									<InsightCard id={group.slug} title={group.title} image={group.image} />
								</ListboxItem>
							))}
						</Listbox>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
};

Groups.getLayout = function getLayout(page: ReactElement) {
	return <AppLayout>{page}</AppLayout>;
};

export default Groups;
