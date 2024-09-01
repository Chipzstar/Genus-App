import type { FC } from "react";
import React, { useCallback, useMemo, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { isMobile } from "react-device-detect";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ClientUploadedFileData } from "uploadthing/types";
import type * as z from "zod";

import { Button } from "@genus/ui/button";
import { Checkbox } from "@genus/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@genus/ui/select";
import { profileSchema } from "@genus/validators";
import { genders, hobbies } from "@genus/validators/constants";

import { useFileContext } from "~/context/FileContext";
import { formatString } from "~/utils";
import type { UserProfile } from "~/utils/types";

type FormValues = z.infer<typeof profileSchema>;

const checkChanges = (values: FormValues, target: UserResource) => {
	return !(values.firstname !== target.firstName || values.lastname !== target.lastName);
};

interface Props {
	startUpload: (files: File[], input?: any) => Promise<ClientUploadedFileData<any>[] | undefined>;
	profile: UserProfile;
	updateUserProfile: any;
	resetMode: () => void;
}

export const EditProfile: FC<Props> = ({ startUpload, profile, updateUserProfile, resetMode }) => {
	const { files } = useFileContext();
	const clerk = useClerk();
	const [loading, setLoading] = useState(false);

	const onSubmit = useCallback(
		async (data: FormValues) => {
			setLoading(true);
			try {
				await updateUserProfile(data);
				if (clerk?.user) {
					const infoChanged = checkChanges(data, clerk.user);
					if (infoChanged) {
						void clerk.user
							.update({
								firstName: data.firstname,
								lastName: data.lastname
							})
							.then(() => console.log("profile updated in Clerk"));
					}
					if (!isMobile && files.length) {
						await clerk.user.setProfileImage({
							file: files[0]!
						});
					}
				}
				setTimeout(resetMode, 300);
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
		[updateUserProfile, files, startUpload, resetMode, clerk.user, isMobile]
	);

	const form = useForm<FormValues>({
		defaultValues: {
			firstname: profile.firstname,
			lastname: profile.lastname,
			gender: profile.gender,
			age: profile.age,
			hobbies_interests: profile.hobbyInterests.map(item => item.slug)
		},
		resolver: zodResolver(profileSchema)
	});

	const isDisabled = useMemo(() => {
		return !form.formState.isDirty && !files.length;
	}, [files.length, form.formState.isDirty]);

	return (
		<Form {...form}>
			<form id="profile-form" className="flex flex-col px-6 py-8 lg:p-8" onSubmit={form.handleSubmit(onSubmit)}>
				<section className="grid gap-x-4 gap-y-4 sm:gap-x-12 md:grid-cols-2">
					<FormField
						control={form.control}
						name="firstname"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input className="bg-background text-black" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastname"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input className="bg-background text-black" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="gender"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Gender</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger className="rounded-xl bg-background text-black">
											<SelectValue placeholder="Select your gender" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{genders.map(gender => (
											<SelectItem key={gender} value={gender}>
												{formatString(gender)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="age"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Age</FormLabel>
								<FormControl>
									<Input
										defaultValue={field.value}
										placeholder="Please enter your age"
										{...field}
										type="number"
										className="rounded-xl bg-background text-black"
										onPaste={e => {
											e.preventDefault();
											return false;
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="order-last col-span-2 row-span-2 md:order-none">
						<FormField
							control={form.control}
							name="hobbies_interests"
							render={() => (
								<FormItem>
									<FormLabel>Hobby interests</FormLabel>
									<FormDescription className="text-neutral-600">
										Select all that apply
									</FormDescription>
									<div className="flex flex-row flex-wrap items-center space-x-2 space-y-2">
										{hobbies.map((item, index) => (
											<FormField
												key={index}
												control={form.control}
												name="hobbies_interests"
												render={({ field }) => {
													return (
														<FormItem
															key={index}
															className="flex flex-row items-start space-x-3 space-y-0"
														>
															<FormControl>
																<Checkbox
																	className="bg-background"
																	checked={field.value?.includes(item)}
																	onCheckedChange={(checked: boolean) => {
																		return checked
																			? field.onChange([...field.value, item])
																			: field.onChange(
																					field.value?.filter(
																						value => value !== item
																					)
																				);
																	}}
																/>
															</FormControl>
															<FormLabel className="whitespace-nowrap font-normal">
																{formatString(item)}
															</FormLabel>
														</FormItem>
													);
												}}
											/>
										))}
									</div>
									<FormMessage className="text-red-500/75" />
								</FormItem>
							)}
						/>
					</div>
				</section>
				<div className="w-full pt-4 sm:pt-6">
					<Button
						type="submit"
						loading={loading}
						disabled={isDisabled}
						form="profile-form"
						size="lg"
						className="h-12 w-full font-semibold"
					>
						<span className="text-lg">Update</span>
					</Button>
				</div>
			</form>
		</Form>
	);
};
