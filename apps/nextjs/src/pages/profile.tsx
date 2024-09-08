"use client";

import type { ReactElement } from "react";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next/types";
import { SignedIn, useAuth, useClerk } from "@clerk/nextjs";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import type { UserResource } from "@clerk/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarIcon, Navbar, NavbarBrand } from "@nextui-org/react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { useDropzone } from "@uploadthing/react/hooks";
import { Pencil } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { isMobile } from "react-device-detect";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { generateClientDropzoneAccept } from "uploadthing/client";
import type { z } from "zod";

import { appRouter, createContextInner } from "@genus/api";
import { transformer } from "@genus/api/transformer";
import { cn } from "@genus/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";
import { Button } from "@genus/ui/button";
import { Form } from "@genus/ui/form";
import { profileSchema } from "@genus/validators";

import { ImageCropper } from "~/components/ImageCropper";
import Loader from "~/components/Loader";
import { EditProfile } from "~/containers/EditProfile";
import { useFileContext } from "~/context/FileContext";
import AppLayout from "~/layout/AppLayout";
import { capitalize, PATHS } from "~/utils";
import { trpc } from "~/utils/trpc";
import { useUploadThing } from "~/utils/uploadthing";

const checkChanges = (values: FormValues, target: UserResource) => {
	return !(values.firstname !== target.firstName || values.lastname !== target.lastName);
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
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

	await helpers.user.getCurrent.prefetch();
	return { props: { userId, ...buildClerkProps(req), trpcState: helpers.dehydrate() } };
};

type FormValues = z.infer<typeof profileSchema>;

const UserProfilePage = () => {
	const { signOut } = useAuth();
	const router = useRouter();
	const { user } = useClerk();
	const [loading, setLoading] = useState(false);
	const posthog = usePostHog();
	const utils = trpc.useUtils();
	const { files, updateFile } = useFileContext();
	const [temp, setTemp] = useState<{ file: File[]; src: string }>({
		file: [],
		src: ""
	});

	const params = new URLSearchParams();

	params.set("height", "200");
	params.set("width", "200");
	params.set("quality", "100");
	params.set("fit", "crop");

	const imageSrc = `${user?.imageUrl}?${params.toString()}`;

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

	// TRPC queries
	const { isLoading, data: profile } = trpc.user.getCurrent.useQuery(undefined, {
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
			setTimeout(() => void utils.user.getCurrent.invalidate(), 300);
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

	const form = useForm<FormValues>({
		defaultValues: {
			firstname: profile.firstname,
			lastname: profile.lastname,
			gender: profile.gender!,
			age: profile.age,
			role_sector: profile.roleSector!,
			hobbies_interests: profile.hobbyInterests.map(item => item.slug)
		},
		resolver: zodResolver(profileSchema)
	});

	const isDisabled = useMemo(() => {
		return !form.formState.isDirty && !files.length;
	}, [files.length, form.formState.isDirty]);

	const onSubmit = useCallback(
		async (data: FormValues) => {
			setLoading(true);
			try {
				await updateUserProfile(data);
				if (user) {
					const infoChanged = checkChanges(data, user);
					if (infoChanged) {
						void user
							.update({
								firstName: data.firstname,
								lastName: data.lastname
							})
							.then(() => console.log("profile updated in Clerk"));
					}
					if (!isMobile && files.length) {
						await user.setProfileImage({
							file: files[0]!
						});
					}
				}
				void router.push(PATHS.HOME);
				// setTimeout(resetMode, 300);
			} catch (err) {
				console.error(err);
				toast.error("Error!", {
					description: "There was an error updating your profile.",
					duration: 5000
				});
			} finally {
				setLoading(false);
			}
		},
		[updateUserProfile, files, startUpload, user, isMobile]
	);

	return (
		<div className="profile-container">
			<Form {...form}>
				<form id="profile-form" onSubmit={form.handleSubmit(onSubmit)}>
					<Navbar
						classNames={{
							base: "p-3 text-white",
							brand: "w-full flex flex-col justify-center items-center space-y-1"
						}}
					>
						<NavbarBrand>
							<div className="absolute left-2 top-2 sm:left-4 sm:top-4">
								<SignedIn>
									<Button
										variant="destructive"
										size="sm"
										onClick={e => {
											void signOut().then(() => posthog.reset());
										}}
									>
										Logout
									</Button>
								</SignedIn>
							</div>
							<div className="absolute right-2 top-2 sm:right-4 sm:top-4">
								<Button
									type="submit"
									loading={loading}
									disabled={isDisabled}
									form="profile-form"
									size="sm"
								>
									<span>Update</span>
								</Button>
							</div>
							<div className="flex grow flex-col items-center justify-center space-y-3">
								<div
									{...getRootProps()}
									className={cn("relative inline-block cursor-pointer rounded-full")}
								>
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
								<EditProfile control={form.control} />
							</div>
						</div>
					)}
					<ImageCropper
						src={temp.src}
						file={temp.file}
						addImage={updateFile}
						onClose={() => setTemp({ file: [], src: "" })}
					/>
				</form>
			</Form>
		</div>
	);
};

UserProfilePage.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};
export default UserProfilePage;
