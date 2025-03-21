"use client";

import type { ReactElement } from "react";
import React, { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import posthog from "posthog-js";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@genus/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import { loginSchema } from "@genus/validators";

import { handleUserOnboarding, PATHS } from "~/utils";
import { trpc } from "~/utils/trpc";
import AuthLayout from "../layout/AuthLayout";
import type { NextPageWithAuthLayout } from "./_app";

const Login: NextPageWithAuthLayout = () => {
	const { isLoaded, signIn, setActive } = useSignIn();
	const { signOut } = useAuth();
	const [loading, setLoading] = React.useState(false);
	const { mutateAsync: checkOnboardingStatus } = trpc.auth.checkOnboardingStatus.useMutation();
	const { mutate: addTempPassword } = trpc.auth.addTempPassword.useMutation();
	const { mutateAsync: checkUserActive } = trpc.auth.checkUserActive.useMutation({
		onSuccess(active) {
			if (!active) {
				void signOut().then(() => posthog.reset());
				toast.info(
					"Your account is not yet active as you are on our waitlist. Please keep a look out for an email to activate your account.",
					{
						duration: 7500
					}
				);
			}
		}
	});

	const router = useRouter();

	const form = useForm<z.infer<typeof loginSchema>>({
		defaultValues: {
			email: "",
			password: ""
		},
		resolver: zodResolver(loginSchema)
	});

	const handleOnboarding = useCallback(
		async (loginInfo: z.infer<typeof loginSchema>) => {
			return handleUserOnboarding(
				loginInfo,
				checkOnboardingStatus,
				signOut,
				addTempPassword,
				toast.info,
				router.push
			);
		},
		[signOut, checkOnboardingStatus]
	);

	const onSubmit = useCallback(
		async (values: z.infer<typeof loginSchema>) => {
			// ✅ This will be type-safe and validated.
			setLoading(true);
			try {
				// handle loading state
				if (!isLoaded) return null;
				const result = await signIn.create({
					identifier: values.email,
					password: values.password
				});
				if (result.status === "complete" && !!result.createdSessionId) {
					if ((await checkUserActive({ email: values.email })) && (await handleOnboarding(values))) {
						await setActive({ session: result.createdSessionId });
						await router.replace(PATHS.HOME);
						return;
					}
				} else {
					// Something went wrong
					if (result.status === "needs_identifier") {
						form.setError("email", { message: "Invalid email address" });
					} else if (result.status === "needs_first_factor") {
						form.setError("password", { message: "Password is incorrect" });
					} else {
						toast.error("Password is incorrect", {
							description: "There was a problem with your request."
						});
					}
				}
				setLoading(false);
			} catch (error: any) {
				setLoading(false);
				if (error.errors.length) {
					if (error.errors[0].message === error.errors[0].longMessage) {
						toast.error(error.errors[0].message);
					} else {
						toast(error.errors[0].message, {
							description: error.errors[0].longMessage
						});
					}
				} else {
					toast.error("Uh oh! Something went wrong.", {
						description: "There was a problem with your request."
					});
				}
			}
		},
		[handleOnboarding, isLoaded, router, setActive]
	);

	return (
		<div className="flex grow flex-col items-center justify-center gap-y-8 px-4 py-8 sm:gap-y-3 sm:py-0">
			<header className="relative flex w-2/3 flex-col items-center space-y-3 sm:min-h-[250px] sm:w-1/2 sm:space-y-0 lg:w-2/3">
				<img src="/images/powered-by-genus-white.png" alt="powered-by-genus" className="w-32" />
				<span className="text-2xl font-semibold sm:pb-3 sm:text-3xl">Welcome to the</span>
				<img
					src="/images/arc2.0-avatar.png"
					alt="genus-white"
					className="mt-0.5 h-36 w-36 sm:h-48 sm:w-96"
					style={{
						objectFit: "contain"
					}}
				/>
				<div className="line-clamp-2 w-screen max-w-96 text-balance text-center sm:py-5">
					<span className="text-2xl font-semibold">
						Arc 2.0 <br />
						Talent Hub!
					</span>
				</div>
			</header>
			<div className="flex w-full flex-col gap-y-6 md:w-1/2 md:gap-y-8">
				<header className="text-center text-2xl font-bold tracking-wider lg:text-4xl lg:tracking-normal">
					Sign in
				</header>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Email address"
											{...field}
											value={field.value.trim()}
											className="md:h-12"
										/>
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
							<Button
								loading={loading}
								type="submit"
								size="lg"
								radius="xl"
								className="h-12 w-full text-lg font-semibold"
							>
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
