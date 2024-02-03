"use client";

import type { ReactElement } from "react";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useClerk } from "@clerk/nextjs";
import { AvatarIcon, Navbar, NavbarBrand } from "@nextui-org/react";
import { Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";
import { toast } from "@genus/ui/use-toast";

import AppLayout from "~/layout/AppLayout";
import { capitalize, formatString } from "~/utils";
import { trpc } from "~/utils/trpc";

const UserProfilePage = () => {
	const router = useRouter();
	const { signOut, user } = useClerk();
	const { data: profile } = trpc.user.getByClerkId.useQuery(undefined, {
		onError(err) {
			toast({
				title: "Error",
				description: err.message,
				duration: 5000
			});
		}
	});

	useEffect(() => {
		console.log(user);
	}, [user]);

	return (
		<div className="mx-auto min-h-screen max-w-4xl py-6 pb-12 text-primary">
			<Navbar
				classNames={{
					base: "p-3 text-white",
					brand: "w-full flex flex-col justify-center items-center space-y-1"
				}}
			>
				<NavbarBrand>
					<div className="absolute right-3 top-0" role="button">
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
						<header className="whitespace-pre-wrap text-center text-xl font-bold text-black sm:w-144 sm:text-3xl">
							{`${user?.firstName} ${user?.lastName}`}
						</header>
					</div>
				</NavbarBrand>
			</Navbar>
			<div className="flex w-full flex-col bg-white p-6">
				{/*<div className="flex flex-col space-y-3 text-lg">
					<span className="text-xl font-bold text-primary">Name / Nickname</span>
					<span>{capitalize(profile?.profileType)}</span>
				</div>*/}
				<div className="mb-3 flex flex-col text-lg">
					<span className="text-xl font-bold text-primary">Profile Type</span>
					<span className="text-black">{capitalize(profile?.profileType)}</span>
				</div>
				<div className="mb-3 flex flex-col text-lg">
					<span className="text-xl font-bold text-primary">Gender</span>
					<span className="text-black">{capitalize(profile?.gender)}</span>
				</div>
				<div className="mb-3 flex flex-col text-lg">
					<span className="text-xl font-bold text-primary">University</span>
					<span className="text-black">{formatString(profile?.university)}</span>
				</div>
				<div className="mb-3 flex flex-col text-lg">
					<span className="text-xl font-bold text-primary">Broad Degree Category</span>
					<span className="text-black">{capitalize(profile?.broadDegreeCourse)}</span>
				</div>
				<div className="mb-3 flex flex-col text-lg">
					<span className="text-xl font-bold text-primary">Degree</span>
					<span className="text-black">{formatString(profile?.degreeName)}</span>
				</div>
				<div className="mb-3 flex flex-col text-lg">
					<span className="text-xl font-bold text-primary">Completion Year</span>
					<span className="text-black">{profile?.completionYear}</span>
				</div>
				<div className="mb-3 flex flex-col text-lg">
					<span className="text-xl font-bold text-primary">Career Interests</span>
					<span className="text-black">
						{profile?.careerInterests.map(item => formatString(item.slug)).join(",")}
					</span>
				</div>
			</div>
		</div>
	);
};

UserProfilePage.getLayout = function getLayout(page: ReactElement) {
	return <AppLayout>{page}</AppLayout>;
};
export default UserProfilePage;
