"use client";

import React, { ReactElement, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useWindowSize } from "usehooks-ts";
import type { z } from "zod";

import { Button } from "@genus/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import { useToast } from "@genus/ui/use-toast";
import { loginSchema } from "@genus/validators";

import { PATHS } from "~/utils";
import AuthLayout from "../layout/AuthLayout";
import type { NextPageWithLayout } from "./_app";

const Login: NextPageWithLayout = () => {
	const { isLoaded, signIn, setActive } = useSignIn();
	const { toast } = useToast();
	const [loading, setLoading] = React.useState(false);
	const { width = 0, height = 0 } = useWindowSize();

	const router = useRouter();
	// 1. Define your form.
	const form = useForm<z.infer<typeof loginSchema>>({
		defaultValues: {
			email: "",
			password: ""
		},
		resolver: zodResolver(loginSchema)
	});

	const onSubmit = useCallback(
		async (values: z.infer<typeof loginSchema>) => {
			// Do something with the form values.
			// ✅ This will be type-safe and validated.
			try {
				setLoading(true);
				// handle loading state
				if (!isLoaded) return null;
				const result = await signIn.create({
					identifier: values.email,
					password: values.password
				});
				if (result.status === "complete" && !!result.createdSessionId) {
					await setActive({ session: result.createdSessionId });
					await router.replace(PATHS.HOME);
					return;
				} else {
					// Something went wrong
					if (result.status === "needs_identifier") {
						form.setError("email", { message: "Invalid email address" });
					} else if (result.status === "needs_first_factor") {
						form.setError("password", { message: "Password is incorrect" });
					} else {
						toast({
							title: "Password is incorrect",
							description: "There was a problem with your request."
						});
					}
				}
				setLoading(false);
			} catch (error: any) {
				setLoading(false);
				if (error.errors.length) {
					if (error.errors[0].message === error.errors[0].longMessage) {
						toast({
							title: error.errors[0].message
						});
					} else {
						toast({
							title: error.errors[0].message,
							description: error.errors[0].longMessage
						});
					}
				} else {
					toast({
						title: "Uh oh! Something went wrong.",
						description: "There was a problem with your request."
					});
				}
			}
		},
		[isLoaded]
	);

	return (
		<div className="flex grow flex-col items-center justify-center gap-12 px-4 py-8">
			<div className="relative flex w-2/3 justify-center sm:h-[250px] sm:w-1/2 lg:w-2/3">
				{/*<Image
					src="/images/logo-white.svg"
					alt="genus-white"
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
					className="mt-0.5"
					quality={100}
					priority
					style={{
						objectFit: "contain"
					}}
				/>*/}
				<object
					className=""
					type="image/svg+xml"
					data="/images/logo-white.svg"
					width={width <= 480 ? 300 : 450}
				/>
			</div>
			<header className="w-[230px] text-center text-2xl font-bold tracking-wider lg:text-4xl">Sign in</header>
			<div className="flex w-full flex-col space-y-12 md:w-1/2">
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
						<div className="flex justify-end">
							<Link href={PATHS.FORGOT_PASSWORD}>Forgot Password?</Link>
						</div>
						<div className="flex flex-col items-center space-y-4">
							<Button loading={loading} type="submit" size="lg" className="h-12 w-full font-semibold">
								Login
							</Button>
							<FormDescription className="font-light text-white">
								{"Don't have an account?"}
								<Link className="font-semibold" href={PATHS.SIGNUP}>
									&nbsp;Sign up
								</Link>
							</FormDescription>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

Login.getLayout = function getLayout(page: ReactElement) {
	return <AuthLayout>{page}</AuthLayout>;
};

export default Login;
