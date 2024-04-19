import type { ChangeEvent, ReactElement } from "react";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { useDebounceValue } from "usehooks-ts";

import { appRouter, createContextInner } from "@genus/api";
import { transformer } from "@genus/api/transformer";
import { Input } from "@genus/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@genus/ui/select";
import { career_interests } from "@genus/validators/constants";

import CompanyCard from "~/components/CompanyCard";
import TopNav from "~/components/TopNav";
import AppLayout from "~/layout/AppLayout";
import { formatString, PATHS } from "~/utils";
import { trpc } from "~/utils/trpc";
import type { Company } from "~/utils/types";

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

	await helpers.company.getCompanies.prefetch();

	return {
		props: {
			userId,
			trpcState: helpers.dehydrate(),
			...buildClerkProps(req)
		}
	};
};

const Companies = () => {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const { data } = trpc.company.getCompanies.useQuery();
	const [companies, setCompanies] = useState<Company[]>(data);
	const [debouncedCompanies] = useDebounceValue<Company[]>(companies, 500);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
			setCompanies(
				prev =>
					data?.filter(company => {
						return company.name.toLowerCase().includes(event.target.value.toLowerCase());
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
					<header className="text-2xl font-bold text-black sm:text-4xl">Companies</header>
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
					<div className="genus-scrollbar flex max-h-120 flex-col overflow-y-scroll">
						<Listbox
							aria-label="Actions"
							items={debouncedCompanies}
							onAction={slug => router.push(`${PATHS.COMPANIES}/${slug}`)}
						>
							{company => (
								<ListboxItem key={company.slug} className="px-0 py-0" textValue={company.name}>
									<CompanyCard company={company} reviews={company.reviews} />
								</ListboxItem>
							)}
						</Listbox>
					</div>
				</div>
			</div>
		</div>
	);
};

Companies.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};
export default Companies;
