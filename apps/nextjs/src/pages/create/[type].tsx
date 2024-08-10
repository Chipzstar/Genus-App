import React from "react";
import type { ReactElement } from "react";
import { AvatarIcon } from "@nextui-org/react";
import { useDropzone } from "@uploadthing/react";
import { toast } from "sonner";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";
import { Badge } from "@genus/ui/badge";
import { Button } from "@genus/ui/button";
import { Label } from "@genus/ui/label";
import { Textarea } from "@genus/ui/textarea";

import { BackButton } from "~/components/BackButton";
import { useFileContext } from "~/context/FileContext";
import AppLayout from "~/layout/AppLayout";
import { useUploadThing } from "~/utils/uploadthing";

const CreatePost = () => {
	const { files, updateFile } = useFileContext();

	const onDrop = (acceptedFile: File[]) => {
		console.log("Files:", acceptedFile);
		updateFile(acceptedFile);
		// Upload the file to your server.
	};

	const { startUpload, permittedFileInfo } = useUploadThing("businessFileUploader", {
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
		<div className="scrollable-page-container overflow-y-hidden pb-20 text-black">
			<div className="relative flex h-full flex-col">
				<div className="mx-auto h-full w-full max-w-3xl p-4">
					<BackButton />
					<div className="flex flex-col items-center">
						<div className="h-32 w-full rounded-md bg-gray-200" />
						<div className="absolute top-32 z-10 mb-4 flex h-28 w-28 items-center justify-center">
							<div {...getRootProps()} className="relative inline-block cursor-pointer">
								<input {...getInputProps()} />
								<Avatar className="h-28 w-28">
									<AvatarImage
										className="relative"
										src={files[0] ? URL.createObjectURL(files[0]) : "/images/logo.png"}
										alt="Avatar Thumbnail"
									></AvatarImage>
									<AvatarFallback className="bg-neutral-300">
										<AvatarIcon />
									</AvatarFallback>
								</Avatar>
							</div>
						</div>
						<h1 className="mb-4 mt-20 text-2xl font-bold md:text-3xl">Business name</h1>
					</div>
					<div className="mb-4">
						<h2 className="text-lg font-semibold">Creator & Admins</h2>
						<div className="mb-2 flex items-center space-x-2">
							<Avatar>
								<AvatarImage src="/placeholder-user.jpg" alt="Kris Gold" />
								<AvatarFallback>KG</AvatarFallback>
							</Avatar>
							<span>Kris Gold</span>
						</div>
						<div className="mb-2 flex items-center space-x-2">
							<Avatar>
								<AvatarImage src="/placeholder-user.jpg" alt="Kris Gold" />
								<AvatarFallback>KG</AvatarFallback>
							</Avatar>
							<span>Kris Gold</span>
						</div>
					</div>
					<div className="mb-4 space-y-3">
						<h2 className="text-lg font-semibold">Tags (up to 5)</h2>
						<Badge size="large" className="border-gray-900 text-primary" variant="outline">
							Cuisine
						</Badge>
					</div>
					<div className="mb-4">
						<Label htmlFor="description" className="text-lg font-semibold">
							Description<span className="text-red-500">*</span>
						</Label>
						<Textarea
							id="description"
							placeholder="Description"
							className="mt-2 w-full border-gray-900 bg-transparent"
						/>
					</div>
					<div className="mb-4">
						<Label htmlFor="social-media" className="text-lg font-semibold">
							Social media handles<span className="text-red-500">*</span>
						</Label>
						<Textarea
							id="social-media"
							placeholder="Social media handles"
							className="mt-2 w-full border-gray-900 bg-transparent"
						/>
					</div>
					<div className="flex justify-center">
						<Button variant="primary" className="w-full max-w-xs rounded-full text-lg text-white">
							Complete
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

CreatePost.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default CreatePost;
