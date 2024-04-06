import type { FC } from "react";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@genus/ui/button";
import { Checkbox } from "@genus/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@genus/ui/select";
import { signupStep2Schema } from "@genus/validators";
import {
	broad_course_categories,
	career_interests,
	completion_years,
	ethnicity_dictionary,
	genders,
	universities,
	university_years
} from "@genus/validators/constants";

import { formatString } from "~/utils";

interface Props {
	step?: number;
}

const Step2: FC<Props> = ({}) => {
	// STATE
	const [loading, setLoading] = useState(false);

	// HOOKS
	const router = useRouter();
	const { isLoaded, signUp, setActive } = useSignUp();

	const form = useForm<z.infer<typeof signupStep2Schema>>({
		defaultValues: {
			gender: "male",
			ethnicity: "african",
			university: "london-school-of-economics-and-political-science",
			completion_year: "2025",
			broad_degree_course: "economics",
			current_year: "3rd_year",
			degree_name: "",
			career_interests: []
		},
		resolver: zodResolver(signupStep2Schema)
	});

	const onSubmit = useCallback(
		async (values: z.infer<typeof signupStep2Schema>) => {
			// ✅ This will be type-safe and validated.
			setLoading(true);
			if (!isLoaded) {
				// handle loading state
				toast.error("Uh oh! Something went wrong.", {
					description: "There was a problem signing you up.",
					action: {
						label: "Try again",
						onClick: () => void onSubmit(values)
					}
				});
				return null;
			}
			try {
				console.log(values);
			} catch (error: any) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
		[isLoaded]
	);

	return (
		<>
			<div className="flex w-full flex-col space-y-12 md:w-1/2">
				<Form {...form}>
					<form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
						<section className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
							<FormField
								control={form.control}
								name="gender"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Gender</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="rounded-xl">
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
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="ethnicity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ethnicity</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="[&>span]: rounded-xl">
													<SelectValue placeholder="Select your ethnicity" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{ethnicity_dictionary.map((e, index) => (
													<SelectGroup key={index}>
														<SelectLabel>{e.label}</SelectLabel>
														{e.values.map(ethnicity => (
															<SelectItem key={ethnicity} value={ethnicity}>
																<span className="whitespace-pre-wrap">
																	{formatString(ethnicity)}
																</span>
															</SelectItem>
														))}
													</SelectGroup>
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
												<SelectTrigger className="rounded-xl">
													<SelectValue placeholder="Select your university" />
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
												<SelectTrigger className="rounded-xl">
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
											<Input {...field} className="rounded-xl" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="current_year"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Current Year</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="rounded-xl">
													<SelectValue placeholder="Select your completion year" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{university_years?.map((year, index) => {
													return (
														<SelectItem key={index} value={year}>
															{formatString(year)}
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
								name="completion_year"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Completion Year</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="rounded-xl">
													<SelectValue placeholder="Select your completion year" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{completion_years?.map((year, index) => {
													if (year)
														return (
															<SelectItem key={index} value={year}>
																{formatString(year)}
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
										<FormDescription className="text-neutral-600">
											Select all that apply
										</FormDescription>
										<div className="space-y-2 sm:flex sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
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
						<div className="pt-6 sm:pt-12">
							<Button
								loading={loading}
								type="submit"
								form="signup-form"
								size="lg"
								className="h-12 w-full font-semibold"
							>
								Continue
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
};

export default Step2;
