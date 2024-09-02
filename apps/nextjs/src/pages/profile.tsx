"use client";

import type { ReactElement } from "react";
import React, { useCallback, useState } from "react";
import type { GetServerSideProps } from "next/types";
import { SignedIn, useAuth, useClerk } from "@clerk/nextjs";
import { AvatarIcon, Navbar, NavbarBrand } from "@nextui-org/react";
import { useDropzone } from "@uploadthing/react/hooks";
import { Pencil } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { isMobile } from "react-device-detect";
import { toast } from "sonner";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { cn } from "@genus/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";
import { Button } from "@genus/ui/button";

import { ImageCropper } from "~/components/ImageCropper";
import Loader from "~/components/Loader";
import { EditProfile } from "~/containers/EditProfile";
import ViewProfile from "~/containers/ViewProfile";
import { useFileContext } from "~/context/FileContext";
import { useViewEditToggle } from "~/hooks/useViewEditToggle";
import AppLayout from "~/layout/AppLayout";
import { getServerSidePropsHelper } from "~/server/serverPropsHelper";
import { capitalize } from "~/utils";
import { trpc } from "~/utils/trpc";
import { useUploadThing } from "~/utils/uploadthing";

export const getServerSideProps: GetServerSideProps = getServerSidePropsHelper;

const UserProfilePage = () => {
	const { signOut } = useAuth();
	const { user } = useClerk();
	const posthog = usePostHog();
	const utils = trpc.useUtils();
	const { files, updateFile } = useFileContext();
	const [temp, setTemp] = useState<{ file: File[]; src: string }>({
		file: [],
		src: ""
	});

	const onDrop = useCallback(
		(acceptedFile: File[]) => {
			if (isMobile && user) {
				updateFile(acceptedFile);
				void user
					.setProfileImage({
						file: acceptedFile[0]!
					})
					.then(() => {
						toast.success("Success!", {
							description: "Profile picture updated successfully!",
							duration: 5000
						});
					})
					.catch(error => {
						console.error(error);
						toast.error("Error!", {
							description: "There was an error updating your profile.",
							duration: 5000,
							action: {
								label: "Report Issue",
								onClick: () => {
									// @ts-expect-error chatwoot popup
									window.$chatwoot.toggle("open");
								}
							}
						});
					});
				return;
			}
			const file = acceptedFile[0];
			if (!file) return;
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				const src = reader.result?.toString() ?? "";
				setTemp({ file: acceptedFile, src });
			});
			reader.readAsDataURL(file);
		},
		[user, updateFile]
	);

	const params = new URLSearchParams();

	params.set("height", "200");
	params.set("width", "200");
	params.set("quality", "100");
	params.set("fit", "crop");

	const imageSrc = `${user?.imageUrl}?${params.toString()}`;

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

	const { startUpload, permittedFileInfo } = useUploadThing("profileUploader", {
		onClientUploadComplete: res => {
			console.log(res);
			console.log("uploaded successfully!");
		},
		onUploadError: err => {
			console.log(err);
			console.log("error occurred while uploading");
			toast.error("Error!", {
				// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
				description: "There was an error updating your profile." + err?.cause,
				duration: 5000
			});
		},
		onUploadBegin: filename => {
			console.log("UPLOAD HAS BEGUN", filename);
		}
	});

	const fileTypes = permittedFileInfo?.config ? Object.keys(permittedFileInfo?.config) : [];

	const { getRootProps, getInputProps } = useDropzone({
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
					<div className="flex grow flex-col items-center justify-center space-y-3">
						<div className="absolute right-2 top-2 sm:right-4 sm:top-4">
							<SignedIn>
								<Button
									size="sm"
									onClick={e => {
										void signOut().then(() => posthog.reset());
									}}
								>
									Logout
								</Button>
							</SignedIn>
						</div>
						<div {...getRootProps()} className={cn("relative inline-block cursor-pointer rounded-full")}>
							<input {...getInputProps()} />
							<Avatar className="h-28 w-28">
								<AvatarImage
									className="relative"
									src={files[0] ? URL.createObjectURL(files[0]) : imageSrc}
									alt="Avatar Thumbnail"
								></AvatarImage>
								<AvatarFallback className="bg-neutral-300">
									<AvatarIcon />
								</AvatarFallback>
							</Avatar>
							<div
								className={cn(
									"absolute bottom-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white"
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
						<EditProfile
							profile={profile!}
							updateUserProfile={updateUserProfile}
							startUpload={startUpload}
						/>
					</div>
				</div>
			)}
			<ImageCropper
				src={temp.src}
				file={temp.file}
				addImage={updateFile}
				onClose={() => setTemp({ file: [], src: "" })}
			/>
		</div>
	);
};

UserProfilePage.getLayout = function getLayout(page: ReactElement, props: { userId: string }) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};
export default UserProfilePage;
