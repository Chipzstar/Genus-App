import type { ReactElement } from "react";
import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { Listbox, ListboxItem, Navbar, NavbarBrand } from "@nextui-org/react";
import { ChevronLeft, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";
import { useToast } from "@genus/ui/use-toast";

import ListBoxWrapper from "~/components/ListBoxWrapper";
import AppLayout from "~/layout/AppLayout";
import { trpc } from "~/utils/trpc";

export const getServerSideProps = (async ctx => {
	const params = ctx.params;
	return {
		props: {
			...params
		} // will be passed to the page component as props
	};
}) satisfies GetServerSideProps;

const Members = (props: any) => {
	const router = useRouter();
	const utils = trpc.useUtils();
	const { toast } = useToast();

	const {
		isLoading,
		data: group,
		failureReason,
		error
	} = trpc.group.getGroupBySlug.useQuery(
		{
			slug: props.slug
		},
		{
			onSuccess: data => {
				console.log(data.members);
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

	const members = useMemo(() => {
		if (!group) return [];
		return group.members.map(member => ({
			key: member.userId,
			label: `${member.user.firstname} ${member.user.lastname}`,
			image: member.user.imageUrl
		}));
	}, [group?.members]);

	return (
		<div className="page-container">
			<Navbar
				classNames={{
					base: "px-3 sm:px-0 pb-3 text-white",
					brand: "w-full flex flex-col justify-center items-center space-y-1"
				}}
			>
				<NavbarBrand>
					<div className="absolute left-0" role="button" onClick={() => router.back()}>
						<ChevronLeft size={40} color="white" />
					</div>
					<Image src="/images/spring-weeks-ldn.svg" alt="genus-white" width={100} height={75} />
					<span className="whitespace-pre-wrap text-lg font-semibold sm:text-2xl">
						InternGen: Spring into Banking
					</span>
					<span className="text-sm sm:text-base">{members?.length} members</span>
				</NavbarBrand>
			</Navbar>
			<div className="chat-wrapper">
				<div className="mx-auto max-w-3xl">
					<header className="text-lg font-semibold sm:text-2xl">Members</header>
					<ListBoxWrapper>
						<Listbox items={members} aria-label="Dynamic Actions" onAction={key => alert(key)}>
							{m => (
								<ListboxItem key={m.key}>
									<div className="flex items-center space-x-2">
										<Avatar className="h-10 w-10 lg:h-10 lg:w-10">
											<AvatarImage src={String(m.image)} alt="Avatar Thumbnail"></AvatarImage>
											<AvatarFallback className="bg-neutral-100">
												<User size={20} color="gray" />
											</AvatarFallback>
										</Avatar>
										<span className="font-medium text-black">{m.label}</span>
									</div>
								</ListboxItem>
							)}
						</Listbox>
					</ListBoxWrapper>
				</div>
			</div>
		</div>
	);
};

Members.getLayout = function getLayout(page: ReactElement) {
	return <AppLayout>{page}</AppLayout>;
};

export default Members;
