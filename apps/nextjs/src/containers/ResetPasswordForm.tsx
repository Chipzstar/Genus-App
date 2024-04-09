import type { FC } from "react";
import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { Button } from "@genus/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import { resetPasswordSchema } from "@genus/validators";

import { PATHS } from "~/utils";

export type NewPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface Props {
	onSubmit: (values: NewPasswordFormValues) => void;
	loading: boolean;
}

const ResetPasswordForm: FC<Props> = ({ onSubmit, loading }) => {
	const form = useForm<z.infer<typeof resetPasswordSchema>>({
		defaultValues: {
			password: "",
			confirmPassword: ""
		},
		resolver: zodResolver(resetPasswordSchema)
	});
	return (
		<div className="flex w-full flex-col space-y-12 md:w-1/2">
			<div className="w-full space-y-3">
				<header className="text-2xl font-bold tracking-wider lg:text-4xl">Reset your password</header>
				<p className="w-2/3">Enter your new password to reset your Genus account.</p>
			</div>
			<div className="flex w-full flex-col space-y-12">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder="Password" {...field} className="md:h-12" type="password" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Confirm Password"
											{...field}
											className="md:h-12"
											type="password"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex flex-col items-center space-y-4">
							<Button
								loading={loading}
								type="submit"
								size="lg"
								className="h-12 w-full text-lg font-semibold"
							>
								Reset
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
		</div>
	);
};

export default ResetPasswordForm;
