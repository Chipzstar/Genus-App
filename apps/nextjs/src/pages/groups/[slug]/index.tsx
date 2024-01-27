import type { ReactElement } from "react";
import React, { useMemo } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import router from "next/router";
import { useClerk, useSession } from "@clerk/nextjs";
import { Navbar, NavbarBrand } from "@nextui-org/react";
import { ThreeDots } from "react-loader-spinner";

import { Alert, AlertDescription, AlertTitle } from "@genus/ui/alert";
import { useToast } from "@genus/ui/use-toast";

import ChatInput from "~/components/ChatInput";
import { GroupStatusButton } from "~/components/GroupStatusButton";
import Messages from "~/components/Messages";
import AppLayout from "~/layout/AppLayout";
import { trpc } from "~/utils/trpc";
import type { GroupMember } from "~/utils/types";

export const getServerSideProps = (async ctx => {
	const params = ctx.params;
	return {
		props: {
			...params
		} // will be passed to the page component as props
	};
}) satisfies GetServerSideProps;

const GroupSlug = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const slug = props.slug as string;
	const { toast } = useToast();
	const utils = trpc.useUtils();
	const { session } = useSession();

	const { mutate: joinGroup } = trpc.group.joinGroup.useMutation({
		onSuccess(data) {
			console.log(data);
			void utils.group.invalidate();
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
	const {
		isLoading,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		data: group,
		failureReason,
		error
	} = trpc.group.getGroupBySlug.useQuery(
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

	const { isMember, btnText, onClick, textSize } = useMemo(() => {
		if (group?.members.find((m: GroupMember) => m.userId === session?.user.id)) {
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
	}, [group?.members, session?.user.id, joinGroup, slug]);

	return (
		<div className="sm:h-container mx-auto flex max-w-3xl flex-col overflow-y-hidden pt-4 text-primary">
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
				<div className="flex grow items-center justify-center p-6 sm:px-12">
					<div className="text-white">
						<ThreeDots
							visible={true}
							height="80"
							width="80"
							color="white"
							radius="9"
							ariaLabel="three-dots-loading"
							wrapperStyle={{}}
							wrapperClass=""
						/>
					</div>
				</div>
			) : group ? (
				<div className="chat-wrapper">
					<Messages chatId={group.groupId} messages={group.messages} isMember={isMember} />
					<ChatInput type="message" chatId={group.groupId} isMember={isMember} />
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

GroupSlug.getLayout = function getLayout(page: ReactElement) {
	return <AppLayout>{page}</AppLayout>;
};

export default GroupSlug;
