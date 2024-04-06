import type { FC } from "react";
import React, { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@genus/ui/button";
import { Checkbox } from "@genus/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@genus/ui/select";
import { signupStep3Schema } from "@genus/validators";
import { career_interests, genders, profile_types } from "@genus/validators/constants";

import { formatString } from "~/utils";

interface Props {}

const Step3: FC<Props> = () => {
	const [loading, setLoading] = useState(false);
	const form = useForm<z.infer<typeof signupStep3Schema>>({
		defaultValues: {
			career_interests: [],
			company_interests: [],
			experience_type: "STUDENT"
		},
		resolver: zodResolver(signupStep3Schema)
	});

	const onSubmit = useCallback(async (values: z.infer<typeof signupStep3Schema>) => {
		// ✅ This will be type-safe and validated.
		setLoading(true);
		try {
			console.log(values);
			toast.success("Welcome to Genus!", {
				description: "Your account has been verified",
				icon: <Check size={20} />
			});
		} catch (error: any) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, []);

	return (
		<div className="flex w-full flex-col space-y-12 md:w-1/2">
			<div className="mt-12 text-center font-semibold sm:mt-0 sm:gap-y-4">
				<span className="text-2.5xl sm:text-5xl sm:leading-tight">
					Career experiences personalised for <span className="underline">you.</span>
				</span>
			</div>
			<Form {...form}>
				<form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
					<section className="grid gap-x-12 gap-y-8">
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
							render={() => (
								<FormItem>
									<FormLabel>Company interests</FormLabel>
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
							name="experience_type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Experience Type</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="rounded-xl">
												<SelectValue placeholder="Select your gender" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{profile_types.map(type => (
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
					<div className="pt-6 sm:pt-12">
						<Button
							loading={loading}
							type="submit"
							form="signup-form"
							size="lg"
							radius="xl"
							className="w-full text-lg font-semibold sm:text-xl"
						>
							Continue
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default Step3;
