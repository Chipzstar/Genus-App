import React, { useCallback, useMemo, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@genus/ui/button";
import { Checkbox } from "@genus/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@genus/ui/select";
import { broadCourseCategorySchema, completionYearSchema, profileSchema, universitiesSchema } from "@genus/validators";
import { broad_course_categories, career_interests, completion_years, universities } from "@genus/validators/constants";

import { useFileContext } from "~/context/FileContext";
import { formatString } from "~/utils";
import type { UserProfile } from "~/utils/types";
import { useUploadThing } from "~/utils/uploadthing";

type FormValues = z.infer<typeof profileSchema>;

export const EditProfile = ({
	profile,
	updateUserProfile,
	resetMode
}: {
	profile: UserProfile;
	updateUserProfile: any;
	resetMode: () => void;
}) => {
	const { files } = useFileContext();
	const clerk = useClerk();
	const [loading, setLoading] = useState(false);

	const { startUpload } = useUploadThing("profileUploader", {
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

	const onSubmit = useCallback(
		async (data: FormValues) => {
			setLoading(true);
			try {
				await updateUserProfile(data);
				if (files.length) {
					void startUpload(files).then(res => {
						if (clerk?.user && res?.[0]) {
							void clerk.user
								.setProfileImage({
									file: files[0]!
								})
								.then(() => console.log("profile image set in Clerk"))
								.catch(err => console.error(err));
						}
					});
				} else {
					clerk?.user &&
						void clerk.user
							.update({
								firstName: data.firstname,
								lastName: data.lastname
							})
							.then(() => console.log("profile updated in Clerk"));
				}
				resetMode();
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
		[updateUserProfile, files, startUpload, resetMode, clerk.user]
	);

	const form = useForm<FormValues>({
		defaultValues: {
			firstname: profile.firstname,
			lastname: profile.lastname,
			university: profile.university as z.infer<typeof universitiesSchema>,
			broad_degree_course: profile.broadDegreeCourse as z.infer<typeof broadCourseCategorySchema>,
			degree_name: profile.degreeName,
			completion_year: String(profile.completionYear) as z.infer<typeof completionYearSchema>,
			career_interests: profile.careerInterests.map(item => item.slug)
		},
		resolver: zodResolver(profileSchema)
	});

	const isDisabled = useMemo(() => {
		return !form.formState.isDirty && !files.length;
	}, [files.length, form.formState.isDirty]);

	return (
		<Form {...form}>
			<form id="profile-form" className="flex flex-col px-6 py-8 lg:p-8" onSubmit={form.handleSubmit(onSubmit)}>
				<section className="grid gap-x-12 gap-y-4 md:grid-cols-2">
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
						name="university"
						render={({ field }) => (
							<FormItem>
								<FormLabel>University</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger className="rounded-xl bg-background text-black">
											<SelectValue placeholder="Select a verified email to display" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{universities?.map((university, index) => {
											if (university)
												return (
													<SelectItem key={index} value={university}>
														{formatString(university)}
													</SelectItem>
												);
										})}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="broad_degree_course"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Broad Degree Course</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger className="rounded-xl bg-background text-black">
											<SelectValue placeholder="Select your degree field category" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{broad_course_categories?.map((course, index) => {
											if (course)
												return (
													<SelectItem key={index} value={course}>
														{formatString(course)}
													</SelectItem>
												);
										})}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="degree_name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Degree name</FormLabel>
								<FormControl>
									<Input {...field} className="rounded-xl bg-background text-black" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="order-last row-span-2 md:order-none">
						<FormField
							control={form.control}
							name="career_interests"
							render={() => (
								<FormItem>
									<FormLabel>Career interests</FormLabel>
									<FormDescription className="text-neutral-600">
										Select all that apply
									</FormDescription>
									<div className="flex flex-col space-y-2 sm:space-y-2">
										{career_interests.map((item, index) => (
											<FormField
												key={index}
												control={form.control}
												name="career_interests"
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
					<FormField
						control={form.control}
						name="completion_year"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Completion Year</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger className="rounded-xl bg-background text-black">
											<SelectValue placeholder="Select your completion year" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{completion_years?.map((course, index) => {
											if (course)
												return (
													<SelectItem key={index} value={course}>
														{formatString(course)}
													</SelectItem>
												);
										})}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
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
						Update
					</Button>
				</div>
			</form>
		</Form>
	);
};
