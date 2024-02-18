import type { ReactElement } from "react";
import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import { useAuth } from "@clerk/nextjs";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { Navbar, NavbarBrand } from "@nextui-org/react";
import { createServerSideHelpers } from "@trpc/react-query/server";

import { appRouter } from "@genus/api";
import { createContextInner } from "@genus/api/src/context";
import { transformer } from "@genus/api/transformer";
import { Alert, AlertDescription, AlertTitle } from "@genus/ui/alert";
import { useToast } from "@genus/ui/use-toast";

import ChatInput from "~/components/ChatInput";
import { GroupStatusButton } from "~/components/GroupStatusButton";
import Loader from "~/components/Loader";
import Messages from "~/components/Messages";
import AppLayout from "~/layout/AppLayout";
import { trpc } from "~/utils/trpc";
import type { GroupMember } from "~/utils/types";

export const getServerSideProps = (async ({ req, params }) => {
	const { userId } = getAuth(req);
	if (!userId) return { props: {} };
	const helpers = createServerSideHelpers({
		router: appRouter,
		transformer,
		ctx: await createContextInner({
			auth: {
				userId
			}
		})
	});
	/*
	 * Prefetching the `group.getGroupBySlug` query.
	 * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
	 */
	params && (await helpers.group.getGroupBySlug.prefetch({ slug: params.slug as string }));

	return {
		props: {
			...params,
			...buildClerkProps(req),
			userId,
			trpcState: helpers.dehydrate()
		} // will be passed to the page component as props
	};
}) satisfies GetServerSideProps;

const GroupSlug = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const router = useRouter();
	const slug = router.query.slug as string;
	const { toast } = useToast();

	const utils = trpc.useUtils();
	const { userId } = useAuth();

	const { mutate: joinGroup } = trpc.group.joinGroup.useMutation({
		onSuccess(data) {
			console.log(data);
			void utils.group.getGroupBySlug.invalidate();
			toast({
				title: "Yayy! You're now in the group! 🎉",
				description: "You can now post to the chat and ask questions"
			});
		},
		onError(error) {
			console.log(error);
			toast({
				title: error.message,
				description: error.message,
				duration: 5000
			});
		}
	});
	const { isLoading, data, failureReason, error } = trpc.group.getGroupBySlug.useQuery(
		{
			slug
		},
		{
			onSuccess: data => {
				console.log(data);
			},
			onError: error => {
				toast({
					title: error?.data?.code ?? "Oops!",
					description: error.message,
					duration: 3000
				});
			}
		}
	);

	useEffect(() => {
		console.log(router.query);
	}, [router.query]);

	const { isMember, btnText, onClick, textSize } = useMemo(() => {
		if (data.group?.members.find((m: GroupMember) => m.userId === userId)) {
			return {
				isMember: true,
				btnText: "Members",
				onClick: () => void router.push(`/groups/${slug}/members`),
				textSize: "text-base"
			};
		}
		return {
			isMember: false,
			btnText: "Join",
			onClick: () => joinGroup({ slug }),
			textSize: "text-xl sm:text-2xl"
		};
	}, [data.group?.members, userId, joinGroup, slug]);

	return (
		<div className="sm:h-container mx-auto flex max-w-3xl flex-col overflow-y-hidden pb-0 pt-4 text-primary">
			<Navbar
				classNames={{
					base: "px-3 sm:px-0 py-3",
					brand: "w-full flex items-center space-x-4"
				}}
			>
				<NavbarBrand>
					<Image src="/images/spring-weeks-ldn.svg" alt="genus-white" width={100} height={75} />
					<span className="whitespace-pre-wrap text-lg font-semibold text-white sm:text-2xl">
						InternGen: Spring into Banking
					</span>
				</NavbarBrand>
				{!isLoading && <GroupStatusButton title={btnText} onClick={onClick} textSize={textSize} />}
			</Navbar>
			{isLoading ? (
				<Loader />
			) : data?.group ? (
				<div className="chat-wrapper">
					<Messages chatId={data.group.groupId} messages={data.messages} isMember={isMember} />
					<ChatInput type="message" chatId={data.group.groupId} isMember={isMember} />
				</div>
			) : (
				<div className="flex h-full flex-col justify-center p-6 sm:px-12">
					<Alert variant="destructive" className="text-center">
						<AlertTitle>Group does not exist!</AlertTitle>
						<AlertDescription>
							{failureReason
								? failureReason.message
								: error
									? error?.message
									: "Please check you are using the right URL"}
						</AlertDescription>
					</Alert>
				</div>
			)}
		</div>
	);
};

GroupSlug.getLayout = function getLayout(page: ReactElement, props: { userId: string }) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default GroupSlug;
