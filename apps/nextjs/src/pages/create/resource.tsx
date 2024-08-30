import type { ReactElement } from "react";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";
import { Badge } from "@genus/ui/badge";
import { Button } from "@genus/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import { Label } from "@genus/ui/label";
import type { Option } from "@genus/ui/multi-select";
import { MultiSelect } from "@genus/ui/multi-select";
import { Textarea } from "@genus/ui/textarea";
import type { CreateResource } from "@genus/validators";
import { CreateResourceSchema } from "@genus/validators";
import { hobbies } from "@genus/validators/constants";

import { useFileContext } from "~/context/FileContext";
import AppLayout from "~/layout/AppLayout";
import TopNav from "~/layout/TopNav";
import { getInitials } from "~/utils";
import { trpc } from "~/utils/trpc";

const defaultTags: Option[] = hobbies.map(hobby => ({
	label: hobby
		.split("_")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" "),
	value: hobby
}));

const NewResource = () => {
	const { files, updateFile, setFiles } = useFileContext();
	const router = useRouter();
	const { user } = useUser();
	const [newAdmin, setNewAdmin] = useState("");
	const { mutateAsync } = trpc.resource.createResource.useMutation();

	const form = useForm<CreateResource>({
		defaultValues: {
			title: "",
			description: "",
			tags: [],
			url: ""
		},
		resolver: zodResolver(CreateResourceSchema)
	});

	const onSubmit = useCallback(async (data: CreateResource) => {
		try {
			const result = await mutateAsync(data);
			console.log(result);
			toast.success("Resource created successfully!", {
				duration: 5000
			});
			router.back();
			setFiles([]);
		} catch (err) {
			console.error(err);
			toast.error("Error!", {
				description: "There was an error creating your resource.",
				duration: 5000
			});
		}
	}, []);

	const author = useMemo(() => {
		if (user) {
			return `${user.firstName} ${user.lastName}`;
		}
	}, [user]);

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
							<div className="mb-4 flex justify-center">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<Input
												{...field}
												placeholder="Recommendation"
												className="mb-2 w-full border-none bg-transparent text-center text-2xl font-bold text-black focus-visible:ring-0 md:text-3xl"
											/>
											<FormMessage className="text-center" />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<div className="mb-4 flex flex-col px-6">
							<h2 className="text-lg font-semibold">Posted By</h2>
							<div className="flex flex-col space-y-2">
								<div className="flex items-center space-x-2">
									<Avatar>
										<AvatarImage src="/placeholder-user.jpg" alt="Kris Gold" />
										<AvatarFallback>{getInitials(author)}</AvatarFallback>
									</Avatar>
									<span>{author}</span>
								</div>
							</div>
						</div>

						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem className="mb-4 flex flex-col space-y-3 px-6">
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
								<FormItem className="mb-4 px-6">
									<FormLabel htmlFor="description" className="text-lg font-semibold">
										Description (optional)
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
							name="url"
							render={({ field }) => (
								<FormItem className="mb-4 px-6">
									<Label htmlFor="social-media" className="text-lg font-semibold">
										URL (optional)
									</Label>
									<Input
										value={field.value}
										onChange={e => field.onChange(e.target.value)}
										id="url-link"
										placeholder=""
										className="mt-2 w-full border-gray-900 bg-transparent text-black"
									/>
								</FormItem>
							)}
						/>
						<div className="mt-8 flex flex-col items-center justify-center md:mt-20">
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

NewResource.getLayout = function getLayout(
	page: ReactElement,
	props: {
		userId: string;
	}
) {
	return <AppLayout userId={props.userId}>{page}</AppLayout>;
};

export default NewResource;
