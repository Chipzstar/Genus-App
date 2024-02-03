import React, { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@genus/ui/button";
import { Checkbox } from "@genus/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@genus/ui/select";
import { toast } from "@genus/ui/use-toast";
import {
	broadCourseCategorySchema,
	completion_years,
	completionYearSchema,
	profileSchema,
	universitiesSchema
} from "@genus/validators";
import { broad_course_categories, career_interests, genders, universities } from "@genus/validators/constants";

import { formatString } from "~/utils";
import type { UserProfile } from "~/utils/types";

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
	const [loading, setLoading] = useState(false);
	const onSubmit = useCallback(async (data: FormValues) => {
		setLoading(true);
		try {
			console.log("-----------------------------------------------");
			console.log(data);
			const result = await updateUserProfile(data);
			toast({
				title: "Success!",
				description: "Your profile has been updated.",
				duration: 5000
			});
			resetMode();
		} catch (err) {
			console.error(err);
			toast({
				title: "Error!",
				description: "There was an error updating your profile.",
				duration: 5000
			});
		} finally {
			setLoading(false);
		}
	}, []);

	const form = useForm<FormValues>({
		defaultValues: {
			firstname: profile.firstname,
			lastname: profile.lastname,
			gender: profile.gender,
			university: profile.university as z.infer<typeof universitiesSchema>,
			broad_degree_course: profile.broadDegreeCourse as z.infer<typeof broadCourseCategorySchema>,
			degree_name: profile.degreeName,
			completion_year: String(profile.completionYear) as z.infer<typeof completionYearSchema>,
			career_interests: profile.careerInterests.map(item => item.slug)
		},
		resolver: zodResolver(profileSchema)
	});

	return (
		<Form {...form}>
			<form id="profile-form" className="flex flex-col p-8" onSubmit={form.handleSubmit(onSubmit)}>
				<section className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
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
											<SelectValue placeholder="Select a verified email to display" />
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
					<FormField
						control={form.control}
						name="career_interests"
						render={() => (
							<FormItem>
								<FormLabel>Career interests</FormLabel>
								<FormDescription className="text-neutral-600">Select all that apply</FormDescription>
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
				</section>
				<div className="w-full pt-4 sm:pt-6">
					<Button
						type="submit"
						loading={loading}
						disabled={!form.formState.isDirty}
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
