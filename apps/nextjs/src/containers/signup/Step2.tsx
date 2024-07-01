import type { FC } from "react";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
	role_sectors,
	universities,
	university_years
} from "@genus/validators/constants";

import { formatString } from "~/utils";
import { trpc } from "~/utils/trpc";
import type { UserState } from "~/utils/types";

interface Props {
	step?: number;
}

const Step2: FC<Props> = () => {
	const { query } = useRouter();
	const { nextStep, context } = useStepper<UserState>();
	const { mutateAsync: updateUser } = trpc.auth.updateUserStep2.useMutation();
	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof signupStep2Schema>>({
		defaultValues: {
			gender: undefined,
			ethnicity: undefined,
			age: undefined,
			role_sector: undefined
		},
		resolver: zodResolver(signupStep2Schema)
	});

	const onSubmit = useCallback(
		async (values: z.infer<typeof signupStep2Schema>) => {
			// ✅ This will be type-safe and validated.
			setLoading(true);
			try {
				console.log(values);
				await updateUser({
					...values,
					email: context?.email ?? query.email
				});
				nextStep();
			} catch (error: any) {
				console.log(error);
				toast.error("Uh oh! Something went wrong.", {
					description: "There was a problem with your request."
				});
			} finally {
				setLoading(false);
			}
		},
		[context.email, nextStep, query]
	);

	return (
		<div className="flex h-full w-full flex-col space-y-12 md:w-1/2 md:justify-center">
			<div className="mt-12 text-center font-semibold sm:mt-0 sm:gap-y-4">
				<span className="text-3xl tracking-wide sm:text-4xl">Almost there...</span>
			</div>
			<Form {...form}>
				<form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
					<section className="grid gap-x-12 gap-y-4">
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
									<FormMessage />
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
											{...field}
											type="number"
											className="rounded-xl"
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
						<FormField
							control={form.control}
							name="role_sector"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="rounded-xl">
												<SelectValue placeholder="Select your role" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{role_sectors?.map((role, index) => {
												if (role)
													return (
														<SelectItem key={index} value={role}>
															{formatString(role)}
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
					<div className="flex items-center justify-center space-x-6 pt-6 sm:space-x-16 sm:pt-12">
						<Button
							loading={loading}
							type="submit"
							radius="xl"
							form="signup-form"
							className="w-64 text-lg font-semibold sm:h-12 sm:w-full sm:text-xl"
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
