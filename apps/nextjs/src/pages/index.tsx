import type { ReactElement } from "react";
import React from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { useUser } from "@clerk/nextjs";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { AvatarIcon, Image } from "@nextui-org/react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { MessageCircleIcon, MessagesSquare } from "lucide-react";

import { appRouter, createContextInner } from "@genus/api";
import { transformer } from "@genus/api/transformer";
import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";

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

	// await helpers.user.getHobbyInterests.prefetch(userId);
	await helpers.business.all.prefetch();

	return {
		props: {
			userId,
			trpcState: helpers.dehydrate(),
			...buildClerkProps(req)
		}
	};
};

const Home = () => {
	const router = useRouter();
	const { user: clerkUser } = useUser();
	const { isLoading, data: user } = trpc.user.getCurrent.useQuery();
	const { data: hobbyInterests } = trpc.user.getHobbyInterests.useQuery(user?.id, { enabled: !!user });
	const { data: businesses } = trpc.business.byOwner.useQuery();

	const params = new URLSearchParams();

	params.set("height", "200");
	params.set("width", "200");
	params.set("quality", "100");
	params.set("fit", "crop");

	const imageSrc = `${clerkUser?.imageUrl}?${params.toString()}`;

	return (
		<div className="scrollable-page-container py-4 md:py-8">
			<TopNav />
			{isLoading ? (
				<Loader />
			) : (
				<div className="mx-auto max-w-3xl">
					<section className="profile-gradient relative flex w-full flex-col items-center justify-center py-6 text-white">
						<div className="absolute left-3 top-3 sm:left-4 sm:top-4">
							<div
								role="button"
								className="flex h-10 grow flex-col items-center justify-center"
								onClick={() => {
									// @ts-expect-error chatwoot popup
									window.$chatwoot.toggle("open");
								}}
							>
								{/*<MessageCircleIcon size={32} className="mr-3" />*/}
								<MessagesSquare size={35} className="mr-3" />
							</div>
						</div>
						<div
							className="absolute right-3 top-3 sm:right-4 sm:top-4"
							role="button"
							onClick={() => router.push(PATHS.PROFILE)}
						>
							<img
								src="/images/cog-white.png"
								alt="cog-wheel-white"
								className="h-10 w-10 hover:animate-spin"
							/>
						</div>
						<Avatar className="h-28 w-28">
							<AvatarImage className="relative" src={imageSrc} alt="Avatar Thumbnail"></AvatarImage>
							<AvatarFallback className="bg-neutral-300">
								<AvatarIcon />
							</AvatarFallback>
						</Avatar>
						<header className="mb-2 mt-4 text-center text-3xl font-bold md:text-5xl">
							{user?.firstname}
						</header>
						<p className="text-balance text-center text-xl font-normal md:text-2xl">
							{formatString(user?.gender)}, {formatString(user?.roleSector)}
						</p>
					</section>
					<div className="flex w-full items-center justify-center gap-x-12 bg-[#F5F5F5]">
						<div role="button" className="h-8 w-8">
							<Image src="/images/instagram.png" />
						</div>
						<div role="button" className="h-8 w-8">
							<Image src="/images/tiktok.png" />
						</div>
					</div>
					<div className="p-6 sm:px-12">
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
								{hobbyInterests?.map(({ hobbyInterest }, index) => (
									<div
										key={index}
										role="button"
										className="flex items-center justify-center rounded-2xl bg-gradient-to-bl from-primary/55 to-secondary-300/55 p-2"
									>
										<span className="text-lg">{hobbyInterest.name}</span>
									</div>
								))}
							</div>
						</section>
						<section className="space-y-2 py-7 font-semibold text-black">
							<h2 className="text-xl font-semibold md:text-2xl">Businesses</h2>
							<div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-12 lg:grid-cols-4">
								{businesses?.map((item, index) => (
									<BusinessCard
										key={index}
										business={item}
										editable={item.ownerId === clerkUser?.id}
									/>
								))}
							</div>
						</section>
					</div>
				</div>
			)}
		</div>
	);
};

Home.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default Home;
