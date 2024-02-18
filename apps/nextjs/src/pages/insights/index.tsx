import React, { ChangeEvent, ReactElement, useCallback, useState } from "react";
import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { SignedIn, useAuth } from "@clerk/nextjs";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Navbar, NavbarBrand } from "@nextui-org/react";
import { useDebounceValue } from "usehooks-ts";

import { Button } from "@genus/ui/button";
import { Input } from "@genus/ui/input";
import { ScrollArea } from "@genus/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@genus/ui/select";
import { career_interests } from "@genus/validators/constants";

import InsightCard from "~/components/InsightCard";
import AppLayout from "~/layout/AppLayout";
import { getAllInsights, getClient } from "~/lib/sanity.client";
import { urlForImage } from "~/lib/sanity.image";
import { formatString, PATHS } from "~/utils";
import type { InsightPanel } from "~/utils/types";

interface PageProps {
	insights: InsightPanel[];
}

type Query = Record<string, string>;

export const getStaticProps: GetStaticProps<PageProps, Query> = async () => {
	const client = getClient();
	const insights = await getAllInsights(client);

	if (!insights) {
		return {
			notFound: true
		};
	}
	const formattedInsights: InsightPanel[] = insights.map(({ slug, title, mainImage }) => ({
		slug: slug,
		title: title,
		image: urlForImage(mainImage).height(100).width(150).url()
	}));
	return {
		props: {
			insights: formattedInsights
		}
	};
};

const Insights = (props: PageProps) => {
	const router = useRouter();
	const { signOut } = useAuth();
	const [search, setSearch] = useState("");
	const [insights, setInsights] = useState<InsightPanel[]>(props.insights);
	const [debouncedInsights] = useDebounceValue<InsightPanel[]>(insights, 500);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
			setInsights(() =>
				props.insights.filter(insight => {
					return insight.title.toLowerCase().includes(event.target.value.toLowerCase());
				})
			);
		},
		[props.insights]
	);

	return (
		<div className="page-container overflow-y-hidden bg-white">
			<Navbar
				classNames={{
					brand: "w-full flex justify-center items-center"
				}}
			>
				<NavbarBrand role="button" onClick={() => router.push(PATHS.HOME)}>
					<object className="mx-auto" type="image/svg+xml" data="/images/green-logo.svg" width={100} />
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
					<header className="text-2xl font-bold text-black sm:text-4xl">Industry Insights</header>
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
										<SelectItem value="all">All types</SelectItem>
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
					<ScrollArea className={"h-[calc(100%-10rem)]"}>
						<Listbox aria-label="Actions" onAction={slug => router.push(`${PATHS.INSIGHTS}/${slug}`)}>
							{debouncedInsights?.map(insight => {
								return (
									<ListboxItem key={insight.slug} className="px-0" textValue={insight.title}>
										<InsightCard id={insight.slug} title={insight.title} image={insight.image} />
									</ListboxItem>
								);
							})}
						</Listbox>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
};

Insights.getLayout = function getLayout(page: ReactElement) {
	return <AppLayout>{page}</AppLayout>;
};
export default Insights;
