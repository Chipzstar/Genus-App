import type { ReactElement } from "react";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ToastAction } from "@genus/ui/toast";
import { toast } from "@genus/ui/use-toast";
import { forgotPasswordSchema, resetPasswordSchema } from "@genus/validators";

import type { EmailFormValues } from "~/components/CheckEmailForm";
import { CheckEmailForm } from "~/components/CheckEmailForm";
import CodeInput, { CodeFormValues } from "~/components/CodeInput";
import ResetPasswordForm, { NewPasswordFormValues } from "~/components/ResetPasswordForm";
import AuthLayout from "~/layout/AuthLayout";
import { trpc } from "~/utils/trpc";

const ResetPassword = () => {
	const [loading, setLoading] = useState(false);
	const [codeInputLoading, setCodeInputLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const { isLoaded, signIn, setActive } = useSignIn();
	const [resetMode, setPasswordResetMode] = useState<"email" | "password" | "code">("email");
	const form = useForm<z.infer<typeof forgotPasswordSchema>>({
		defaultValues: {
			email: ""
		},
		resolver: zodResolver(forgotPasswordSchema)
	});
	const { mutateAsync: checkEmail } = trpc.auth.checkEmailExists.useMutation();

	const onEmailSubmit = useCallback(
		async (values: EmailFormValues) => {
			setLoading(true);
			try {
				if (!isLoaded) return null;
				const exists = await checkEmail({ email: values.email });
				if (!exists) {
					toast({
						title: "Email does not exist",
						description: "Please enter a valid email address"
					});
				} else {
					setPasswordResetMode("password");
					setEmail(values.email);
				}
			} catch (err) {
				console.error(err);
				toast({
					title: "Uh oh! Something went wrong.",
					description: "There was a problem with your request."
				});
			} finally {
				setLoading(false);
			}
		},
		[isLoaded, checkEmail]
	);

	const onPasswordSubmit = useCallback(
		async (values: NewPasswordFormValues) => {
			setLoading(true);
			try {
				// handle loading state
				if (!isLoaded) return null;
				const result = await signIn?.create({
					strategy: "reset_password_email_code",
					identifier: email
				});
				if (result.status === "needs_first_factor") {
					toast({
						title: "Email sent!",
						description: "Please check your email for a verification code to reset your password.",
						action: (
							<ToastAction
								altText="Try again"
								onSubmit={() =>
									onPasswordSubmit(values).then(() => console.log("New verification code sent!"))
								}
							>
								Resend reset email
							</ToastAction>
						),
						duration: 1000 * 60
					});
					setNewPassword(values.password);
					setPasswordResetMode("code");
				} else {
					// Something went wrong
					if (result.status === "needs_identifier") {
						form.setError("email", { message: "Invalid email address" });
					} else {
						console.log(result);
						toast({
							title: "Email does not exist",
							description: "There was a problem with your request."
						});
					}
				}
			} catch (error: any) {
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
			} finally {
				setLoading(false);
			}
		},
		[email, form, isLoaded, signIn]
	);

	const onReset = useCallback(
		async (digits: CodeFormValues) => {
			setCodeInputLoading(true);
			const code = Object.values(digits).join("");
			if (!isLoaded || !signIn) return null;
			try {
				const result = await signIn.attemptFirstFactor({
					strategy: "reset_password_email_code",
					code,
					password: newPassword
				});
				if (result.status === "needs_second_factor") {
					console.log("************************************************");
					console.log("2FA required!!!!");
					console.log("************************************************");
				} else if (result.status === "complete") {
					await setActive({ session: result.createdSessionId });
					toast({
						title: "Password reset successful!",
						description: "We're logging you in..."
					});
				} else {
					console.log(result);
					toast({
						title: "Uh oh! Something went wrong.",
						description: "There was a problem with your request."
					});
				}
			} catch (err: any) {
				console.error("error", err.errors[0].longMessage);
				toast({
					title: err.errors[0].message,
					description: err.errors[0].longMessage
				});
			} finally {
				setCodeInputLoading(false);
			}
		},
		[isLoaded, newPassword, setActive, signIn]
	);

	return (
		<div className="flex grow flex-col items-center justify-center gap-12 px-4 py-8">
			<CodeInput
				opened={resetMode === "code"}
				setOpen={state => (state ? setPasswordResetMode("code") : setPasswordResetMode("password"))}
				onSubmit={onReset}
				loading={codeInputLoading}
			/>
			<div className="relative h-[250px] w-2/3 sm:w-1/2 lg:w-2/3">
				<Image
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
				/>
			</div>
			{resetMode !== "email" ? (
				<ResetPasswordForm onSubmit={onPasswordSubmit} loading={loading} />
			) : (
				<CheckEmailForm onSubmit={onEmailSubmit} loading={loading} />
			)}
		</div>
	);
};

ResetPassword.getLayout = function getLayout(page: ReactElement) {
	return <AuthLayout>{page}</AuthLayout>;
};

export default ResetPassword;
