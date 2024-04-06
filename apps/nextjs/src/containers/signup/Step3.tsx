import type { FC } from "react";
import React, { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@genus/ui/button";
import { Checkbox } from "@genus/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
import { signupStep3Schema } from "@genus/validators";
import { career_interests } from "@genus/validators/constants";

import { formatString } from "~/utils";

interface Props {}

const Step3: FC<Props> = ({}) => {
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
		} catch (error: any) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, []);

	return (
		<div className="flex w-full flex-col space-y-12 md:w-1/2">
			<div className="gap-y-4">
				<span className="text-2xl sm:text-4xl">Almost there...</span>
			</div>
			<Form {...form}>
				<form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
					<section className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
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
	);
};

export default Step3;
