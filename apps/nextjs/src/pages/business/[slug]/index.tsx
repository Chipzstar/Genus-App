import type { ReactElement } from "react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { AvatarIcon, Image } from "@nextui-org/react";
import { createServerSideHelpers } from "@trpc/react-query/server";

import { appRouter, createContextInner } from "@genus/api";
import { transformer } from "@genus/api/transformer";
import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";
import { Input } from "@genus/ui/input";

import { BusinessCard } from "~/components/BusinessCard";
import Loader from "~/components/Loader";
import AppLayout from "~/layout/AppLayout";
import { PATHS } from "~/utils";
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

	ctx.params && (await helpers.business.getBusinessBySlug.prefetch({ slug: ctx.params.slug as string }));

	return {
		props: {
			userId,
			trpcState: helpers.dehydrate(),
			...buildClerkProps(req)
		}
	};
};

const BusinessDetails = () => {
	const router = useRouter();
	const slug = router.query.slug as string;
	const { isLoading, data: business } = trpc.business.getBusinessBySlug.useQuery(
		{ slug },
		{
			onSuccess: data => {
				const { firstname, lastname, imageUrl } = data.owner;
				setOwner(`${firstname} ${lastname}`);
				if (imageUrl) setOwnerAvatar(imageUrl);
			}
		}
	);
	const { data: otherBusinesses } = trpc.business.getBusinessesByOwner.useQuery(
		{
			ownerId: business!.ownerId,
			ignoreSlug: business!.slug
		},
		{ enabled: !!business }
	);
	const [owner, setOwner] = React.useState<string>(`${business?.owner.firstname} ${business?.owner.lastname}` ?? "");
	const [ownerAvatar, setOwnerAvatar] = React.useState<string>(business?.owner.imageUrl ?? "");

	if (isLoading) return <Loader />;

	if (!business) return <div>Business not found</div>;

	return (
		<div className="scrollable-page-container overflow-y-hidden pb-20 text-black">
			<div className="relative flex h-full flex-col">
				<div className="mx-auto h-full w-full max-w-3xl pb-4 sm:px-4">
					<div className="flex flex-col items-center">
						<div className="w-full">
							<Image
								src={business.logoUrl}
								className="h-64 w-full"
								alt="overlay"
								width="100%"
								style={{
									objectFit: "cover",
									opacity: 0.5
								}}
							/>
						</div>
						<div className="absolute top-16 z-10 mb-4 flex flex-col items-center justify-center">
							<div className="relative inline-block cursor-pointer">
								<Avatar className="h-28 w-28">
									<AvatarImage className="relative" src={business.logoUrl} alt="Avatar Thumbnail" />
									<AvatarFallback className="bg-neutral-300">
										<AvatarIcon />
									</AvatarFallback>
								</Avatar>
							</div>
							<div className="flex justify-center bg-gray-400/50">
								<Input
									value={business.name}
									readOnly
									placeholder="Business Name"
									className="mb-4 w-full border-none bg-transparent text-center text-2xl font-bold focus-visible:ring-0 md:text-3xl"
								/>
							</div>
						</div>
					</div>

					<section className="flex w-full items-center justify-center gap-x-12 bg-[#F5F5F5]">
						{business.instagram && (
							<Link href={business.instagram} target="_blank" rel="noopener noreferrer">
								<div className="h-8 w-8">
									<Image src="/images/instagram.png" />
								</div>
							</Link>
						)}
						{business.tiktok && (
							<Link href={business.tiktok} target="_blank" rel="noopener noreferrer">
								<div className="h-8 w-8">
									<Image src="/images/tiktok.png" />
								</div>
							</Link>
						)}
						{business.linkedin && (
							<Link href={business.linkedin} target="_blank" rel="noopener noreferrer">
								<div role="button" className="h-8 w-8">
									<Image src="/images/youtube.png" />
								</div>
							</Link>
						)}
						{business.websiteUrl && (
							<Link href={`mailto:${business.websiteUrl}`} target="_blank" rel="noopener noreferrer">
								<div role="button" className="h-8 w-8">
									<Image src="/images/email.png" />
								</div>
							</Link>
						)}
					</section>

					<div className="my-4 space-y-6 px-4">
						<h2 className="text-xl font-semibold italic text-black">About Owner</h2>
						<div className="flex items-center space-x-5">
							<div className="flex flex-col space-y-2">
								<Avatar className="h-20 w-20">
									<AvatarImage className="relative" src={ownerAvatar} alt="Avatar Thumbnail" />
									<AvatarFallback className="bg-neutral-300">
										<AvatarIcon />
									</AvatarFallback>
								</Avatar>
							</div>
							<div className="flex flex-col space-y-2">
								<h3 className="text-xl font-semibold text-black">{owner}</h3>
								<Link href={`${PATHS.MEMBERS}/${business.ownerId}/profile`}>
									<span className="text-lg font-bold text-primary underline">View Profile</span>
								</Link>
							</div>
						</div>
					</div>

					<div className="mt-12 space-y-6 px-4">
						<h2 className="text-xl font-semibold italic text-black">Other Ventures from owner</h2>
						<div className="genus-scrollbar grid grid-cols-2 flex-col gap-x-4 overflow-y-scroll text-black sm:grid-cols-3 lg:grid-cols-4">
							{otherBusinesses?.map((business, index) => (
								<BusinessCard key={index} business={business} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

BusinessDetails.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default BusinessDetails;
