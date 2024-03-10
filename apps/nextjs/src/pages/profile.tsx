"use client";

import React, { ReactElement, useCallback, useRef } from "react";
import { GetServerSideProps } from "next/types";
import { useClerk } from "@clerk/nextjs";
import { AvatarIcon, Navbar, NavbarBrand } from "@nextui-org/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useToggle } from "usehooks-ts";

import { cn } from "@genus/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";

import { EditProfile } from "~/components/EditProfile";
import Loader from "~/components/Loader";
import ViewProfile from "~/components/ViewProfile";
import { useFileContext } from "~/context/FileContext";
import { useViewEditToggle } from "~/hooks/useViewEditToggle";
import AppLayout from "~/layout/AppLayout";
import { getServerSidePropsHelper } from "~/server/serverPropsHelper";
import { capitalize } from "~/utils";
import { trpc } from "~/utils/trpc";
import { useUploadThing } from "~/utils/uploadthing";

export const getServerSideProps: GetServerSideProps = getServerSidePropsHelper;

const UserProfilePage = () => {
	const [mode, toggle, setValue] = useViewEditToggle();
	const [opened, toggleBell, setBell] = useToggle(false);
	const utils = trpc.useUtils();
	const { files, updateFile } = useFileContext();
	const onDrop = useCallback(
		(acceptedFile: File[]) => {
			updateFile(acceptedFile);
		},
		[updateFile]
	);

	const { signOut, user } = useClerk();

	// TRPC queries
	const { isLoading, data: profile } = trpc.user.getByClerkId.useQuery(undefined, {
		onError(err) {
			toast.error("Error", {
				description: err.message,
				duration: 5000
			});
		}
	});
	const { mutateAsync: updateUserProfile } = trpc.user.updateProfile.useMutation({
		onSuccess() {
			toast.success("Success!", {
				description: "Your profile has been updated.",
				duration: 3000
			});
			setTimeout(() => void utils.user.getByClerkId.invalidate(), 300);
		}
	});

	const { permittedFileInfo } = useUploadThing("profileUploader", {
		onClientUploadComplete: res => {
			console.log(res);
			console.log("uploaded successfully!");
		},
		onUploadError: err => {
			console.log(err);
			console.log("error occurred while uploading");
		},
		onUploadBegin: filename => {
			console.log("UPLOAD HAS BEGUN", filename);
		}
	});

	const fileTypes = permittedFileInfo?.config ? Object.keys(permittedFileInfo?.config) : [];

	const { getRootProps, getInputProps } = useDropzone({
		disabled: mode === "view",
		onDrop,
		accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
		maxFiles: 1
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
						<img
							src="/images/cog-white.svg"
							alt="cog-wheel-white"
							className="h-6 w-6 hover:animate-spin lg:h-10 lg:w-10"
						/>
					</div>
					<div className="flex grow flex-col items-center justify-center space-y-3">
						<div
							{...getRootProps()}
							className={cn("relative inline-block rounded-full", { "cursor-pointer": mode === "edit" })}
						>
							<input {...getInputProps()} />
							<Avatar className="h-28 w-28">
								<AvatarImage
									className="relative"
									src={files[0] ? URL.createObjectURL(files[0]) : user?.imageUrl}
									alt="Avatar Thumbnail"
								></AvatarImage>
								<AvatarFallback className="bg-neutral-300">
									<AvatarIcon />
								</AvatarFallback>
							</Avatar>
							<div
								className={cn(
									"absolute bottom-2 right-2 inline-flex h-6 w-6 items-center" +
										" justify-center rounded-full bg-white",
									{
										hidden: mode === "view"
									}
								)}
							>
								<Pencil color="black" size={14} />
							</div>
						</div>
						<div className="flex flex-col items-center space-y-1">
							<header className="whitespace-pre-wrap text-center text-xl font-bold text-white sm:w-144 sm:text-3xl">
								{`${user?.firstName} ${user?.lastName}`}
							</header>
							<span className="sm:text-xl">{capitalize(profile?.profileType)}</span>
						</div>
					</div>
				</NavbarBrand>
			</Navbar>
			{isLoading ? (
				<Loader />
			) : (
				<div className="profile-form mb-4 flex flex-col bg-white pb-8 lg:pb-0">
					<div className="mx-auto h-full w-full max-w-3xl">
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
			)}
		</div>
	);
};

UserProfilePage.getLayout = function getLayout(page: ReactElement, props: { userId: string }) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};
export default UserProfilePage;
