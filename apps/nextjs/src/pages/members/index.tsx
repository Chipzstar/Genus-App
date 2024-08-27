import type { ChangeEvent, ReactElement } from "react";
import React, { useCallback, useState } from "react";
import type { GetServerSideProps } from "next";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { User } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";

import { appRouter, createContextInner } from "@genus/api";
import { transformer } from "@genus/api/transformer";
import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";
import { career_interests } from "@genus/validators/constants";

import { BackButton } from "~/components/BackButton";
import SearchFilterPanel from "~/components/SearchFilterPanel";
import AppLayout from "~/layout/AppLayout";
import TopNav from "~/layout/TopNav";
import type { RouterOutputs } from "~/utils/trpc";
import { trpc } from "~/utils/trpc";

type Members = RouterOutputs["user"]["getUsers"];

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

const MembersDirectory = () => {
	const [search, setSearch] = useState("");
	const { data } = trpc.user.getUsers.useQuery(undefined, {
		onSuccess: data => {
			setMembers(data);
		}
	});
	const [members, setMembers] = useState<Members>([]);
	const [debouncedMembers] = useDebounceValue<Members>(members, 500);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
			setMembers(
				prev =>
					data?.filter(r => {
						return (
							r.firstname.toLowerCase().includes(event.target.value.toLowerCase()) ||
							r.lastname.toLowerCase().includes(event.target.value.toLowerCase())
						);
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
							<header className="text-2xl font-bold text-black sm:text-4xl">Members Directory</header>
						</section>
					</nav>
					<SearchFilterPanel
						value={search}
						onChange={handleChange}
						categories={career_interests}
						classNames="sm:w-full"
						withFilter={false}
					/>
					<div className="genus-scrollbar grid flex-col gap-y-3 overflow-y-scroll text-black lg:grid-cols-2">
						{debouncedMembers.map((member, index) => (
							<div key={index} className="flex items-center space-x-2">
								<Avatar className="h-10 w-10 lg:h-10 lg:w-10">
									<AvatarImage src={String(member.imageUrl)} alt="Avatar Thumbnail"></AvatarImage>
									<AvatarFallback className="bg-neutral-100">
										<User size={20} color="gray" />
									</AvatarFallback>
								</Avatar>
								<span className="font-medium text-black">
									{member.firstname + " " + member.lastname}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

MembersDirectory.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default MembersDirectory;
