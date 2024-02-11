"use client";

import React, { ReactElement, useCallback } from "react";
import { useRouter } from "next/router";
import { useClerk } from "@clerk/nextjs";
import { AvatarIcon, Navbar, NavbarBrand } from "@nextui-org/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { Pencil } from "lucide-react";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { cn } from "@genus/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";
import { toast } from "@genus/ui/use-toast";

import { EditProfile } from "~/components/EditProfile";
import ViewProfile from "~/components/ViewProfile";
import { useFileContext } from "~/context/FileContext";
import { useViewEditToggle } from "~/hooks/useViewEditToggle";
import AppLayout from "~/layout/AppLayout";
import { trpc } from "~/utils/trpc";
import { useUploadThing } from "~/utils/uploadthing";

const UserProfilePage = () => {
	const [mode, toggle, setValue] = useViewEditToggle();
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
	const { data: profile } = trpc.user.getByClerkId.useQuery(undefined, {
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
			void utils.user.getByClerkId.invalidate();
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
						<img src="/images/cog-white.svg" alt="cog-wheel-white" className="h-6 w-6 lg:h-10 lg:w-10" />
					</div>
					<div className="flex grow flex-col items-center justify-center space-y-3">
						<div
							{...getRootProps()}
							className={cn("relative inline-block rounded-full", { "cursor-pointer": mode === "edit" })}
						>
							<input {...getInputProps()} />
							<Avatar className="h-28 w-28 lg:h-36 lg:w-36">
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
