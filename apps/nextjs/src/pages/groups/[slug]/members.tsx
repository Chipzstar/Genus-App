import { ReactElement, useMemo } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { Image, Listbox, ListboxItem, Navbar, NavbarBrand } from "@nextui-org/react";
import { ChevronLeft, User } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";

import ListBoxWrapper from "~/components/ListBoxWrapper";
import AppLayout from "~/layout/AppLayout";
import { NextPageWithAppLayout } from "~/pages/_app";
import { trpc } from "~/utils/trpc";

export const getServerSideProps = (async ({ params, req }) => {
	const { userId } = getAuth(req);
	if (!userId) return { props: {} };
	return {
		props: {
			...params,
			userId,
			...buildClerkProps(req)
		}
	};
}) satisfies GetServerSideProps;

const Members: NextPageWithAppLayout<any> = (props: any) => {
	const router = useRouter();
	const utils = trpc.useUtils();

	const { isLoading, data, failureReason, error } = trpc.group.getGroupBySlug.useQuery(
		{
			slug: props.slug
		},
		{
			onSuccess: data => {
				console.log(data.group.members);
			},
			onError: error => {
				toast.error(error?.data?.code ?? "Oops!", {
					description: error.message,
					duration: 3000
				});
			}
		}
	);

	const members = useMemo(() => {
		if (!data) return [];
		return data.group.members.map(member => ({
			key: member.userId,
			label: `${member.user.firstname} ${member.user.lastname}`,
			image: member.user.imageUrl
		}));
	}, [data?.group.members]);

	return (
		<div className="page-container">
			<Navbar
				classNames={{
					base: "px-3 pb-3 text-white",
					brand: "w-full flex flex-col justify-center items-center space-y-1"
				}}
			>
				<NavbarBrand>
					<div className="absolute left-0 top-0" role="button" onClick={() => router.back()}>
						<ChevronLeft size={40} color="white" />
					</div>
					<Image
						src="/images/spring-weeks-ldn.svg"
						alt="genus-white"
						width={100}
						height={75}
						className="opacity-1"
					/>
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
						<Listbox items={members} aria-label="Dynamic Actions">
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

Members.getLayout = function getLayout(page: ReactElement, props: { userId: string }) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default Members;
