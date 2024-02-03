"use client";

import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { useClerk } from "@clerk/nextjs";
import { AvatarIcon, Navbar, NavbarBrand } from "@nextui-org/react";

import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";
import { toast } from "@genus/ui/use-toast";

import { EditProfile } from "~/components/EditProfile";
import ViewProfile from "~/components/ViewProfile";
import { useViewEditToggle } from "~/hooks/useViewEditToggle";
import AppLayout from "~/layout/AppLayout";
import { trpc } from "~/utils/trpc";

const UserProfilePage = () => {
	const router = useRouter();
	const [mode, toggle, setValue] = useViewEditToggle();
	const utils = trpc.useUtils();
	const { signOut, user } = useClerk();
	const { isLoading, data: profile } = trpc.user.getByClerkId.useQuery(undefined, {
		onError(err) {
			toast({
				title: "Error",
				description: err.message,
				duration: 5000
			});
		}
	});
	const { mutateAsync: updateUserProfile } = trpc.user.updateProfile.useMutation({
		onSuccess() {
			utils.user.getByClerkId.invalidate();
		}
	});

	return (
		<div className="profile-container">
			<Navbar
				classNames={{
					base: "p-3 text-white",
					brand: "w-full flex flex-col justify-center items-center space-y-1"
				}}
			>
				<NavbarBrand>
					<div className="absolute right-3 top-3" role="button" onClick={toggle}>
						<img src="/images/cog-white.svg" alt="cog-wheel-white" className="h-6 w-6 lg:h-10 lg:w-10" />
					</div>
					<div className="flex grow flex-col items-center justify-center space-y-3">
						<Avatar className="h-28 w-28 lg:h-40 lg:w-40">
							<AvatarImage
								className="AvatarImage"
								src={user?.imageUrl}
								alt="Avatar Thumbnail"
							></AvatarImage>
							<AvatarFallback className="bg-neutral-300">
								<AvatarIcon />
							</AvatarFallback>
						</Avatar>
						<header className="whitespace-pre-wrap text-center text-xl font-bold text-white sm:w-144 sm:text-3xl">
							{`${user?.firstName} ${user?.lastName}`}
						</header>
					</div>
				</NavbarBrand>
			</Navbar>
			<div className="mb-4 flex h-full flex-col bg-white">
				{mode === "edit" ? (
					<EditProfile
						profile={profile!}
						updateUserProfile={updateUserProfile}
						resetMode={() => setValue("view")}
					/>
				) : (
					<ViewProfile profile={profile} />
				)}
			</div>
		</div>
	);
};

UserProfilePage.getLayout = function getLayout(page: ReactElement) {
	return <AppLayout>{page}</AppLayout>;
};
export default UserProfilePage;
