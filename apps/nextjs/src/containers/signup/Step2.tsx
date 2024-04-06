import type { FC } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@genus/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
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
import { useStepper } from "@genus/ui/stepper";
import { signupStep2Schema } from "@genus/validators";
import {
	broad_course_categories,
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

const Step2: FC<Props> = () => {
	const { nextStep, prevStep } = useStepper();
	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof signupStep2Schema>>({
		defaultValues: {
			gender: undefined,
			ethnicity: undefined,
			university: undefined,
			completion_year: undefined,
			broad_degree_course: undefined,
			current_year: undefined,
			degree_name: undefined
		},
		resolver: zodResolver(signupStep2Schema)
	});

	const onSubmit = useCallback(
		async (values: z.infer<typeof signupStep2Schema>) => {
			// ✅ This will be type-safe and validated.
			setLoading(true);
			try {
				console.log(values);
				nextStep();
			} catch (error: any) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
		[nextStep]
	);

	useEffect(() => {
		form.reset();
	}, []);

	return (
		<div className="flex w-full flex-col space-y-12 md:w-1/2">
			<div className="mt-12 text-center font-semibold sm:mt-0 sm:gap-y-4">
				<span className="text-3xl tracking-wide sm:text-4xl">Almost there...</span>
			</div>
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
								</FormItem>
							)}
						/>
						<div className="lg:col-span-2">
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
									</FormItem>
								)}
							/>
						</div>
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
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-x-8 gap-y-4">
							<FormField
								control={form.control}
								name="current_year"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Current Year</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="rounded-xl">
													<SelectValue placeholder="Select year" />
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
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="completion_year"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Year end</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="rounded-xl">
													<SelectValue placeholder="Select year" />
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
									</FormItem>
								)}
							/>
						</div>
					</section>
					<div className="flex items-center justify-around space-x-6 pt-6 sm:space-x-16 sm:pt-12">
						<Button
							onClick={() => form.reset()}
							loading={loading}
							type="button"
							radius="xl"
							variant="back"
							className="px-unit-xl font-semibold sm:w-full sm:text-xl"
						>
							Go back
						</Button>
						<Button
							loading={loading}
							type="submit"
							radius="xl"
							form="signup-form"
							className="px-unit-xl font-semibold sm:w-full sm:text-xl"
						>
							Continue
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default Step2;
