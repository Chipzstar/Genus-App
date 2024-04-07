import type { FC } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@genus/ui/button";
import { Checkbox } from "@genus/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
import type { Option } from "@genus/ui/multi-select";
import { MultiSelect } from "@genus/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@genus/ui/select";
import { signupStep3Schema } from "@genus/validators";
import { career_interests, companies, experience_types, profile_types } from "@genus/validators/constants";

import { formatString } from "~/utils";

const company_options: Option[] = companies.map(company => ({
	label: company
		.split("_")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" "),
	value: company
}));

const Step3: FC = () => {
	const [loading, setLoading] = useState(false);
	const form = useForm<z.infer<typeof signupStep3Schema>>({
		defaultValues: {
			career_interests: [],
			company_interests: [],
			experience_type: undefined
		},
		resolver: zodResolver(signupStep3Schema)
	});

	const onSubmit = useCallback(async (values: z.infer<typeof signupStep3Schema>) => {
		// ✅ This will be type-safe and validated.
		setLoading(true);
		try {
			console.log(values);
			window.open("https://hodpo2py6ju.typeform.com/to/XOethBN1", "_blank");
		} catch (error: any) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		console.log(form.formState.errors);
	}, [form.formState.errors]);

	return (
		<div className="flex w-full flex-col space-y-12 md:w-1/2">
			<div className="mt-12 text-balance text-center font-semibold sm:mt-0 sm:gap-y-4">
				<span className="text-2.5xl sm:text-4xl sm:leading-tight">
					Career experiences personalised for <span className="underline">you.</span>
				</span>
			</div>
			<Form {...form}>
				<form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
					<section className="grid gap-x-12 gap-y-4 sm:gap-y-8">
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
						<FormField
							control={form.control}
							name="company_interests"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Company interests</FormLabel>
									<div className="space-y-2 sm:flex sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
										<MultiSelect
											value={field.value.map(value => ({
												label: formatString(value),
												value
											}))}
											onChange={options => field.onChange(options.map(o => o.value))}
											defaultOptions={company_options}
											placeholder="Select companies you like..."
											emptyIndicator={
												<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
													no results found.
												</p>
											}
										/>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="experience_type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Experience Type</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="rounded-xl">
												<SelectValue placeholder="Select your experience type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{experience_types.map(type => (
												<SelectItem key={type} value={type}>
													{formatString(type.toLowerCase())}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
					</section>
					<div className="flex flex-col items-center space-y-5 pt-6 sm:pt-12">
						<div className="text-pretty text-center text-2xl font-semibold sm:text-3xl sm:leading-tight">
							<span>Share your ANONYMOUS review</span>
						</div>
						<div>
							<Button
								loading={loading}
								type="submit"
								form="signup-form"
								size="lg"
								radius="xl"
								className="text-lg font-semibold sm:text-xl"
							>
								Click here
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default Step3;
