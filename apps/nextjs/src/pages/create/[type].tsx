import type { ReactElement } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarIcon, Image } from "@nextui-org/react";
import { useDropzone } from "@uploadthing/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";
import { Badge } from "@genus/ui/badge";
import { Button } from "@genus/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import { Label } from "@genus/ui/label";
import type { Option } from "@genus/ui/multi-select";
import { MultiSelect } from "@genus/ui/multi-select";
import { Textarea } from "@genus/ui/textarea";
import type { CreateBusiness } from "@genus/validators";
import { CreateBusinessSchema } from "@genus/validators";
import { hobbies } from "@genus/validators/constants";

import Loader from "~/components/Loader";
import { useFileContext } from "~/context/FileContext";
import AppLayout from "~/layout/AppLayout";
import TopNav from "~/layout/TopNav";
import { getInitials } from "~/utils";
import { trpc } from "~/utils/trpc";
import { useUploadThing } from "~/utils/uploadthing";

const defaultTags: Option[] = hobbies.map(hobby => ({
	label: hobby
		.split("_")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" "),
	value: hobby
}));

const CreatePost = () => {
	const { files, updateFile, setFiles } = useFileContext();
	const router = useRouter();
	const { user } = useUser();
	const [newAdmin, setNewAdmin] = useState("");
	const { mutateAsync } = trpc.business.createBusiness.useMutation();

	const form = useForm<CreateBusiness>({
		defaultValues: {
			title: "",
			description: "",
			tags: [],
			admins: [],
			tiktok: "",
			instagram: "",
			linkedIn: "",
			logoUrl: undefined,
			other: ""
		},
		resolver: zodResolver(CreateBusinessSchema)
	});

	const { startUpload, permittedFileInfo, isUploading } = useUploadThing("businessFileUploader", {
		onClientUploadComplete: files => {
			console.log(files);
			if (files[0]) {
				form.setValue("logoUrl", files[0].url);
			}
			console.log("uploaded successfully!");
		},
		onUploadError: err => {
			console.log(err);
			console.log(err.message);
			console.log("error occurred while uploading");
			toast.error("Error!", {
				// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
				description: "There was an error uploading your image." + err?.cause,
				duration: 5000
			});
		},
		onUploadBegin: filename => {
			console.log("UPLOAD HAS BEGUN", filename);
		}
	});

	const onDrop = (acceptedFile: File[]) => {
		console.log("Files:", acceptedFile);
		updateFile(acceptedFile);
		// Upload the file to your server.
		void startUpload(acceptedFile);
	};

	const fileTypes = permittedFileInfo?.config ? Object.keys(permittedFileInfo?.config) : [];

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
		maxFiles: 1
	});

	const admins = form.watch("admins");

	const onSubmit = useCallback(async (data: CreateBusiness) => {
		try {
			const result = await mutateAsync(data);
			console.log(result);
			toast.success("Business created successfully!", {
				duration: 5000
			});
			router.back();
			setFiles([]);
		} catch (err) {
			console.error(err);
			toast.error("Error!", {
				description: "There was an error creating your business.",
				duration: 5000
			});
		}
	}, []);

	useEffect(() => {
		if (user) {
			form.setValue("admins", [`${user.firstName} ${user.lastName}`]);
		}
	}, [user]);

	useEffect(() => {
		if (form.formState.errors.logoUrl) {
			toast.error("Error!", {
				description: "Please upload your business logo.",
				duration: 5000
			});
		}
	}, [form.formState.errors]);

	return (
		<div className="scrollable-page-container overflow-y-hidden pb-20 pt-6 text-black">
			<TopNav />
			<div className="relative flex h-full flex-col">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="mx-auto h-full w-full max-w-3xl pb-4 sm:px-4"
					>
						<div className="flex flex-col items-center">
							{isUploading ? (
								<div className="h-32">
									<Loader color="#2AA6B7" />
								</div>
							) : (
								<>
									<div className="mb-4 flex h-28 w-28 items-center justify-center">
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
								</>
							)}
							<div className="mb-4 flex justify-center">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<Input
												{...field}
												placeholder="Business Name"
												className="mb-2 w-full border-none bg-transparent text-center text-2xl font-bold text-black focus-visible:ring-0 md:text-3xl"
											/>
											<FormMessage className="text-center" />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<div className="mb-4 px-4">
							<h2 className="text-lg font-semibold">Creator & Admins</h2>
							<div className="flex flex-col space-y-2">
								{admins.map((admin, index) => (
									<div key={index} className="flex items-center space-x-2">
										<Avatar>
											<AvatarImage src="/placeholder-user.jpg" alt="Kris Gold" />
											<AvatarFallback>{getInitials(admin)}</AvatarFallback>
										</Avatar>
										<span>{admin}</span>
									</div>
								))}
							</div>
							<Input
								value={newAdmin}
								onChange={e => setNewAdmin(e.target.value)}
								placeholder="Add new admin"
								className="mb-4 w-full border-none bg-transparent text-lg font-semibold text-gray-500 focus-visible:ring-0"
								onKeyDown={e => {
									if (e.key === "Enter") {
										form.setValue("admins", [...admins, newAdmin]);
										setNewAdmin("");
									}
								}}
							/>
						</div>

						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem className="mb-4 flex flex-col space-y-3 px-4">
									<FormLabel className="text-lg font-semibold">Tags (up to 5)</FormLabel>
									<div className="flex flex-wrap space-x-2">
										{field.value.map((tag, index) => (
											<Badge
												key={index}
												size="large"
												className="border-gray-900 text-primary"
												variant="outline"
											>
												{tag}
											</Badge>
										))}
									</div>
									<MultiSelect
										defaultOptions={defaultTags}
										value={field.value.map(tag => ({ label: tag, value: tag }))}
										onChange={tags => field.onChange(tags.map(tag => tag.value.toLowerCase()))}
										maxSelected={5}
										placeholder="Start typing to add tags"
										creatable
										className="border-gray-900 bg-transparent"
										emptyIndicator={
											<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
												no results found.
											</p>
										}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="mb-4 px-4">
									<FormLabel htmlFor="description" className="text-lg font-semibold">
										Description <span className="text-red-500">*</span>
									</FormLabel>
									<Textarea
										value={field.value}
										onChange={e => field.onChange(e.target.value)}
										id="description"
										placeholder="Description"
										className="mt-2 w-full border-gray-900 bg-transparent"
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="tiktok"
							render={({ field }) => (
								<FormItem className="mb-4 px-4">
									<Label htmlFor="social-media" className="text-lg font-semibold">
										Tiktok handle
									</Label>
									<Input
										value={field.value}
										onChange={e => field.onChange(e.target.value)}
										id="social-media"
										placeholder="@business"
										className="mt-2 w-full border-gray-900 bg-transparent text-black"
									/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="instagram"
							render={({ field }) => (
								<FormItem className="mb-4 px-4">
									<Label htmlFor="social-media" className="text-lg font-semibold">
										Instagram handle
									</Label>
									<Input
										value={field.value}
										onChange={e => field.onChange(e.target.value)}
										id="social-media"
										placeholder="@business"
										className="mt-2 w-full border-gray-900 bg-transparent text-black"
									/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="linkedIn"
							render={({ field }) => (
								<FormItem className="mb-4 px-4">
									<Label htmlFor="social-media" className="text-lg font-semibold">
										LinkedIn handle
									</Label>
									<Input
										value={field.value}
										onChange={e => field.onChange(e.target.value)}
										id="social-media"
										placeholder="@business"
										className="mt-2 w-full border-gray-900 bg-transparent text-black"
									/>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="other"
							render={({ field }) => (
								<FormItem className="mb-4 px-4">
									<Label htmlFor="social-media" className="text-lg font-semibold">
										Other social media handle(s)
										<br /> (comma-separated)
									</Label>
									<Textarea
										value={field.value}
										onChange={e => field.onChange(e.target.value)}
										id="social-media"
										placeholder="Other social media handles"
										className="mt-2 w-full border-gray-900 bg-transparent text-black"
									/>
								</FormItem>
							)}
						/>
						<div className="flex justify-center">
							<Button
								type="submit"
								variant="primary"
								className="w-full max-w-xs rounded-full text-lg text-white"
							>
								Complete
							</Button>
						</div>
					</form>
				</Form>
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
