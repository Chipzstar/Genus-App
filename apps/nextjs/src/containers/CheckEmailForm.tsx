import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@genus/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import { forgotPasswordSchema } from "@genus/validators";

import { PATHS } from "~/utils";

export type EmailFormValues = z.infer<typeof forgotPasswordSchema>;

interface EmailForm {
	onSubmit: (values: EmailFormValues) => void;
	loading: boolean;
}

export const CheckEmailForm = ({ onSubmit, loading }: EmailForm) => {
	const form = useForm<EmailFormValues>({
		defaultValues: {
			email: ""
		},
		resolver: zodResolver(forgotPasswordSchema)
	});
	return (
		<div className="flex flex-col space-y-12">
			<div className="space-y-3">
				<header className="text-2xl font-bold sm:tracking-wider lg:text-4xl">Find your Genus account</header>
				<p className="">Enter the email associated with your account to change your password.</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="Email address" {...field} className="md:h-12" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex flex-col items-center space-y-4">
						<Button loading={loading} type="submit" size="lg" className="h-12 w-full font-semibold">
							Next
						</Button>
						<FormDescription className="font-light text-white">
							{"Already have an account?"}
							<Link className="font-semibold" href={PATHS.LOGIN}>
								&nbsp;Login
							</Link>
						</FormDescription>
					</div>
				</form>
			</Form>
		</div>
	);
};
