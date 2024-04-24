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
import { career_interests } from "@genus/validators/constants";

import CompanyCard from "~/components/CompanyCard";
import SearchFilterPanel from "~/components/SearchFilterPanel";
import AppLayout from "~/layout/AppLayout";
import TopNav from "~/layout/TopNav";
import { PATHS } from "~/utils";
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
					<SearchFilterPanel value={search} onChange={handleChange} categories={career_interests} />
					<div className="genus-scrollbar flex max-h-120 flex-col overflow-y-scroll">
						<Listbox
							aria-label="Actions"
							items={debouncedCompanies}
							onAction={slug => router.push(`${PATHS.COMPANIES}/${slug}`)}
						>
							{company => (
								<ListboxItem key={company.slug} className="px-0 py-0" textValue={company.name}>
									<CompanyCard company={company} reviews={company.reviews} hideRating />
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
