import type { FC } from "react";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@genus/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@genus/ui/form";
import type { Option } from "@genus/ui/multi-select";
import { MultiSelect } from "@genus/ui/multi-select";
import { useStepper } from "@genus/ui/stepper";
import { signupStep3Schema } from "@genus/validators";
import { hobbies } from "@genus/validators/constants";
import { decryptString, prettyPrint } from "@genus/validators/helpers";

import { env } from "~/env";
import WaitingList from "~/modals/WaitingList";
import { formatString, PATHS } from "~/utils";
import { trpc } from "~/utils/trpc";
import type { UserState } from "~/utils/types";

const hobby_interest_options: Option[] = hobbies.map(hobby => ({
	label: hobby
		.split("_")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" "),
	value: hobby
}));

const { NEXT_PUBLIC_AXIOM_TOKEN } = env;

const Step3: FC = () => {
	const { query, replace } = useRouter();
	const [open, setOpen] = useState(false);
	const { isLoaded, signIn, setActive } = useSignIn();
	const { context } = useStepper<UserState>();
	const [loading, setLoading] = useState(false);
	const { mutateAsync: updateUser } = trpc.auth.updateUserStep3.useMutation();
	const { mutateAsync: checkUserActive } = trpc.auth.checkUserActive.useMutation();

	const form = useForm<z.infer<typeof signupStep3Schema>>({
		defaultValues: {
			hobbies_interests: []
		},
		resolver: zodResolver(signupStep3Schema)
	});

	const handleLogin = useCallback(
		async (email: string, password: string) => {
			if (!isLoaded) {
				// handle loading state
				toast.error("Uh oh! Something went wrong.", {
					description: "There was a problem signing you up.",
					action: {
						label: "Try again",
						onClick: () => void handleLogin(email, password)
					}
				});
				return null;
			}
			// check if the user is active
			if (!(await checkUserActive({ email }))) {
				setOpen(true);
				setTimeout(() => void replace(PATHS.LOGIN), 1500);
				return null;
			}
			const result = await signIn.create({
				identifier: email,
				password
			});
			if (result.status === "complete" && !!result.createdSessionId) {
				await setActive({ session: result.createdSessionId });
				await replace(PATHS.HOME);
				toast.success("Welcome to Genus!", {
					description: "Your account has been verified",
					icon: <Check size={20} />
				});
				return;
			} else {
				if (result.status === "needs_identifier") {
					throw new Error("Invalid email address");
				} else if (result.status === "needs_first_factor") {
					throw new Error("Password is incorrect");
				} else {
					throw new Error("There was a problem with your request.");
				}
			}
		},
		[isLoaded, replace, setActive]
	);

	const onSubmit = useCallback(
		async (values: z.infer<typeof signupStep3Schema>) => {
			// ✅ This will be type-safe and validated.
			const email = context?.email ?? query.email;
			console.log(email);
			setLoading(true);
			try {
				const user = await updateUser({
					...values,
					email
				});
				prettyPrint(user);
				await handleLogin(email, decryptString(user.tempPassword, NEXT_PUBLIC_AXIOM_TOKEN));
			} catch (error: any) {
				console.log(error);
				toast.error("Uh oh! Something went wrong.", {
					description: error.message
				});
			} finally {
				setLoading(false);
			}
		},
		[context, query]
	);

	return (
		<>
			<WaitingList open={open} onClose={() => setOpen(false)} />
			<div className="flex w-full flex-col space-y-12 md:w-1/2">
				<div className="mt-12 text-balance text-center font-semibold sm:mt-0 sm:gap-y-4">
					<span className="text-2.5xl sm:text-4xl sm:leading-tight">
						Third-spaces and communities for <span className="underline">you.</span>
					</span>
				</div>
				<Form {...form}>
					<form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
						<section className="grid w-full grid-cols-1 gap-x-12 gap-y-4 sm:gap-y-8">
							<FormField
								control={form.control}
								name="hobbies_interests"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Hobbies & Interests</FormLabel>
										<div className="flex flex-col items-center space-y-7">
											{/*{fields.map((field, index) => (
												<Select
													key={field.id}
													value={values[index]}
													onValueChange={val => {
														append(val);
													}}
												>
													<FormControl>
														<SelectTrigger className="rounded-xl">
															<SelectValue placeholder="Select your hobby" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{hobby_interest_options?.map((hobby, index) => {
															if (hobby)
																return (
																	<SelectItem key={index} value={hobby.value}>
																		{formatString(hobby.label)}
																	</SelectItem>
																);
														})}
													</SelectContent>
												</Select>
											))}
											<Select
												value={values[values.length]}
												onValueChange={val => {
													console.log(val);
													append(val);
												}}
											>
												<FormControl>
													<SelectTrigger className="rounded-xl">
														<SelectValue placeholder="Add your hobby" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{hobbies?.map((hobby, index) => {
														if (hobby)
															return (
																<SelectItem key={index} value={hobby}>
																	{formatString(hobby)}
																</SelectItem>
															);
													})}
												</SelectContent>
											</Select>
											*/}
											<MultiSelect
												value={field.value.map(value => ({
													label: formatString(value),
													value
												}))}
												maxSelected={5}
												onChange={options => field.onChange(options.map(o => o.value))}
												defaultOptions={hobby_interest_options}
												placeholder="Select up to 5 hobbies & interests"
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
						</section>
						<div className="flex flex-col items-center space-y-5 pt-6 sm:pt-12">
							<div>
								<Button
									loading={loading}
									type="submit"
									form="signup-form"
									size="lg"
									radius="xl"
									className="text-lg font-semibold sm:text-xl"
								>
									Continue
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
};

export default Step3;
