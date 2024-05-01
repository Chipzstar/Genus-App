import type { ReactElement } from "react";
import React, { FC, useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@genus/ui";
import { Button } from "@genus/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";

import AuthLayout from "~/layout/AuthLayout";

const LIMIT = 3;

const referralFormSchema = z.object({
	emails: z.array(
		z.object({
			value: z.string().email({ message: "Please enter a valid email." })
		})
	)
});

type ReferralFormValues = z.infer<typeof referralFormSchema>;

const ReferAFriend = () => {
	const [loading, setLoading] = useState(false);
	const form = useForm<ReferralFormValues>({
		resolver: zodResolver(referralFormSchema),
		defaultValues: {
			emails: [
				{
					value: ""
				}
			]
		},
		mode: "onChange"
	});

	const { fields, append } = useFieldArray({
		name: "emails",
		control: form.control
	});

	const onSubmit = useCallback(
		async (values: ReferralFormValues) => {
			// check if there is a query param for email
			if (window?.location.search) {
				const query = new URLSearchParams(window.location.search);
				const email = query.get("email");
				const name = query.get("name");
				if (!email) {
					toast.error(
						"It looks like you are visiting this page from the wrong source. " +
							"This page is intended to be used as a referral link after completing our review form"
					);
					return;
				}

				if (fields.length > LIMIT) {
					toast.error("You can only add up to 3 emails.");
					return;
				}
				if (fields.length === 0) {
					toast.error("Please add at least one email.");
					return;
				}
				try {
					setLoading(true);
					const result = await fetch("/api/email/send", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							subject: "Refer a Friend",
							referrerName: name,
							referrerEmail: email,
							recipients: values.emails.map(email => email.value)
						})
					});
					console.log(await result.json());
					toast.success("Emails sent!");
				} catch (err: any) {
					console.error(err.message);
					toast.error("Uh oh! Something went wrong.", {
						description: "There was a problem with your request."
					});
				} finally {
					setLoading(false);
				}
			}
		},
		[fields]
	);

	return (
		<div className="page-container flex items-center justify-center">
			<div className="w-full max-w-lg space-y-6 rounded-lg bg-white p-6 shadow-md">
				<h1 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100">Refer a Friend 🤝</h1>
				<div className="flex justify-center text-center">
					<p className="mt-2 max-w-sm text-xl text-gray-600 dark:text-gray-400">
						Invite your friends to join and get a chance to win a prize! 🎁
					</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
						<div className="space-y-2">
							<div className="flex flex-col space-y-2">
								{fields.map((field, index) => (
									<FormField
										control={form.control}
										key={field.id}
										name={`emails.${index}.value`}
										render={({ field }) => {
											return (
												<FormItem>
													<FormLabel className={cn(index !== 0 && "sr-only")}>
														{"Friend's Email"}
													</FormLabel>
													<FormControl>
														<Input
															className="bg-transparent text-black"
															id="email"
															{...field}
															placeholder="Enter your friend's email"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											);
										}}
									/>
								))}
								<div className="pt-2">
									<Button
										type="button"
										className="w-fit"
										size="sm"
										variant="outline"
										onClick={() => {
											if (fields.length < LIMIT) {
												append({
													value: ""
												});
											} else {
												toast.warning("You can only add up to " + LIMIT + " emails.");
											}
										}}
									>
										Add Another
									</Button>
								</div>
							</div>
						</div>
						<Button
							loading={loading}
							className="w-full"
							size="lg"
							type="submit"
							disabled={!form.formState.isValid}
						>
							<span className="text-lg font-medium">Send Invite 📨</span>
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

ReferAFriend.getLayout = function getLayout(page: ReactElement) {
	return <AuthLayout>{page}</AuthLayout>;
};

export default ReferAFriend;
