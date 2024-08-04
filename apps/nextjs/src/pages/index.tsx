import type { FC, ReactElement } from "react";
import React from "react";
import { useRouter } from "next/router";
import { Image } from "@nextui-org/react";

import Loader from "~/components/Loader";
import AppLayout from "~/layout/AppLayout";
import TopNav from "~/layout/TopNav";
import { formatString, PATHS } from "~/utils";
import type { RouterOutputs } from "~/utils/trpc";
import { trpc } from "~/utils/trpc";

const BusinessCard: FC<{ business: RouterOutputs["business"]["getAll"][number] }> = props => {
	const { name, logoUrl, tags } = props.business;
	console.log(tags);
	return (
		<div
			className="relative w-36 overflow-hidden"
			style={{
				borderRadius: "35px"
			}}
		>
			<Image src={logoUrl ?? "/images/logo.png"} width="100%" />
			<div
				className="absolute bottom-0 z-10 flex h-14 w-full flex-col bg-gray-400/50 px-3 pt-2 text-white"
				style={{
					borderRadius: "0 0 35px 35px"
				}}
			>
				<span>{name}</span>
				<div className="flex flex-wrap text-wrap">
					{tags.map((tag, index) => (
						<span key={index} className="inline-block rounded-full text-xs font-semibold tracking-tight">
							#{tag}&nbsp;
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

const Home = () => {
	const router = useRouter();
	const { isLoading, data: user } = trpc.user.getByClerkId.useQuery();
	const { data: hobbyInterests } = trpc.user.getHobbyInterests.useQuery(user?.id, { enabled: !!user });
	const { data: businesses } = trpc.business.getAll.useQuery();

	return (
		<div className="scrollable-page-container">
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
							<Image src="/images/instagram.svg" />
							<Image src="/images/tiktok.svg" />
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

Home.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default Home;
