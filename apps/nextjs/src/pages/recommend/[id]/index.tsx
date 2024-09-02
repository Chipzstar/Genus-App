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
import TopNav from "~/layout/TopNav";
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

	ctx.params && (await helpers.resource.getResourceById.prefetch(ctx.params.id as string));

	return {
		props: {
			userId,
			trpcState: helpers.dehydrate(),
			...buildClerkProps(req)
		}
	};
};

const ResourceDetails = () => {
	const router = useRouter();
	const resourceId = router.query.id as string;
	const [author, setAuthor] = React.useState<string>("");
	const [authorAvatar, setAuthorAvatar] = React.useState<string>("");
	const { isLoading, data: resource } = trpc.resource.getResourceById.useQuery(resourceId, {
		onSuccess: data => {
			const { firstname, lastname, imageUrl } = data.author;
			setAuthor(`${firstname} ${lastname}`);
			if (imageUrl) setAuthorAvatar(imageUrl);
		}
	});

	if (isLoading) return <Loader />;

	if (!resource)
		return <div className="flex h-full w-full items-center justify-center text-2xl">Resource not found</div>;

	return (
		<div className="scrollable-page-container overflow-y-hidden py-4 text-black md:py-8">
			<TopNav />
			<div className="mx-auto h-full w-full max-w-3xl py-4 sm:px-4">
				<div className="flex flex-col items-center">
					<div className="flex justify-center">
						<Input
							value={resource.name}
							readOnly
							placeholder="Business Name"
							className="mb-4 w-full border-none bg-transparent text-center text-2xl font-bold text-black focus-visible:ring-0 md:text-3xl"
						/>
					</div>
				</div>

				<section className="flex w-full items-center justify-center gap-x-12 bg-[#F5F5F5]">
					<div role="button" className="h-8 w-8">
						<Image src="/images/instagram.png" />
					</div>
					<div role="button" className="h-8 w-8">
						<Image src="/images/tiktok.png" />
					</div>
					<div role="button" className="h-8 w-8">
						<Image src="/images/youtube.png" />
					</div>
					<div role="button" className="h-8 w-8">
						<Image src="/images/email.png" />
					</div>
				</section>

				<div className="my-4 space-y-6 px-4">
					<h2 className="text-xl font-semibold italic text-black">Posted By</h2>
					<div className="flex items-center space-x-5">
						<div className="flex flex-col space-y-2">
							<Avatar className="h-20 w-20">
								<AvatarImage className="relative" src={authorAvatar} alt="Avatar Thumbnail" />
								<AvatarFallback className="bg-neutral-300">
									<AvatarIcon />
								</AvatarFallback>
							</Avatar>
						</div>
						<div className="flex flex-col space-y-2">
							<h3 className="text-xl font-semibold text-black">{author}</h3>
							<Link href={`${PATHS.MEMBERS}/${resource.authorId}/profile`}>
								<span className="text-lg font-bold text-primary underline">View Profile</span>
							</Link>
						</div>
					</div>
				</div>

				<div className="my-8 space-y-2 px-4">
					<h2 className="text-xl font-semibold italic text-black">Description</h2>
					<div className="text-lg text-black">{resource.description}</div>
				</div>

				<div className="my-8 space-y-2 px-4">
					<h2 className="text-xl font-semibold italic text-black">Url</h2>
					<div className="text-lg text-black">
						{resource.url ? (
							<Link href={resource.url} target="_blank">
								{resource.url}
							</Link>
						) : (
							"N/A"
						)}
					</div>
				</div>

				<div className="my-8 space-y-2 px-4">
					<h2 className="text-xl font-semibold italic text-black">Tags</h2>
					<div className="flex flex-wrap gap-2">
						{resource.tags.map((tag, index) => (
							<span
								key={index}
								className="rounded-full bg-primary px-2 py-1 text-sm font-semibold text-white"
							>
								#{tag}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

ResourceDetails.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default ResourceDetails;
