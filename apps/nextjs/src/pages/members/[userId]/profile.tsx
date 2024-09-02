import type { ReactElement } from "react";
import React from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { Image } from "@nextui-org/react";
import { createServerSideHelpers } from "@trpc/react-query/server";

import { appRouter, createContextInner } from "@genus/api";
import { transformer } from "@genus/api/transformer";

import { BusinessCard } from "~/components/BusinessCard";
import Loader from "~/components/Loader";
import AppLayout from "~/layout/AppLayout";
import TopNav from "~/layout/TopNav";
import { formatString, PATHS } from "~/utils";
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

	ctx.params && (await helpers.user.getByClerkId.prefetch({ userId: ctx.params.userId as string }));

	return {
		props: {
			userId,
			trpcState: helpers.dehydrate(),
			...buildClerkProps(req)
		}
	};
};

const MemberProfile = () => {
	const router = useRouter();
	const userId = router.query.userId as string;
	const { isLoading, data: user } = trpc.user.getByClerkId.useQuery({ userId });
	const { data: hobbyInterests } = trpc.user.getHobbyInterests.useQuery(user?.id, { enabled: !!user });
	const { data: businesses } = trpc.business.all.useQuery();

	return (
		<div className="scrollable-page-container py-6 md:py-8">
			<TopNav />
			{isLoading ? (
				<Loader />
			) : (
				<div className="home-wrapper">
					<div className="mx-auto max-w-3xl">
						<header className="mb-4 text-center text-3xl font-bold text-black md:text-5xl">
							{user?.firstname}
						</header>
						<p className="text-balance text-center text-xl font-semibold italic text-black md:text-2xl">
							{formatString(user?.gender)}, {formatString(user?.roleSector)}
						</p>
						<div className="mt-12 flex w-full items-center justify-center gap-x-12 bg-[#F5F5F5]">
							<div role="button" className="h-8 w-8">
								<Image src="/images/instagram.png" />
							</div>
							<div role="button" className="h-8 w-8">
								<Image src="/images/tiktok.png" />
							</div>
						</div>
						<section
							className="space-y-2 py-6 font-semibold text-black"
							role="button"
							onClick={() => router.push(PATHS.CHURCH)}
						>
							<h2 className="text-xl font-semibold md:text-2xl">Community</h2>
							<div className="flex items-center space-x-2">
								<Image src="/images/arc2.0.svg" />
								<span className="text-lg">Arc 2.0</span>
							</div>
						</section>
						<section className="space-y-2 py-3 font-semibold text-black">
							<h2 className="text-xl font-semibold md:text-2xl">Interests</h2>
							<div className="grid grid-cols-3 gap-3 md:grid-cols-5">
								{hobbyInterests?.map(({ hobbyInterest, index }) => (
									<div
										role="button"
										key={index}
										className="flex items-center justify-center rounded-2xl bg-gradient-to-bl from-primary/55 to-secondary-300/55 p-2"
									>
										<span className="text-lg">{hobbyInterest.name}</span>
									</div>
								))}
							</div>
						</section>
						<section className="space-y-2 py-7 font-semibold text-black">
							<h2 className="text-xl font-semibold md:text-2xl">Businesses</h2>
							<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
								{businesses?.map((item, index) => <BusinessCard key={index} business={item} />)}
							</div>
						</section>
					</div>
				</div>
			)}
		</div>
	);
};

MemberProfile.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default MemberProfile;
