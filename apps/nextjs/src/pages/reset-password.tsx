import type { ReactElement } from "react";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

import type { loginSchema } from "@genus/validators";
import { forgotPasswordSchema } from "@genus/validators";

import CodeInput from "~/components/CodeInput";
import type { EmailFormValues } from "~/containers/CheckEmailForm";
import { CheckEmailForm } from "~/containers/CheckEmailForm";
import type { NewPasswordFormValues } from "~/containers/ResetPasswordForm";
import ResetPasswordForm from "~/containers/ResetPasswordForm";
import AuthLayout from "~/layout/AuthLayout";
import { handleUserOnboarding } from "~/utils";
import { trpc } from "~/utils/trpc";

const ResetPassword = () => {
	const router = useRouter();
	// STATE
	const [loading, setLoading] = useState(false);
	const { signOut } = useAuth();
	const [codeInputLoading, setCodeInputLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const { isLoaded, signIn, setActive } = useSignIn();
	const [resetMode, setPasswordResetMode] = useState<"email" | "password" | "code">("email");

	// TRPC
	const { mutateAsync: checkEmail } = trpc.auth.checkEmailExists.useMutation();
	const { mutateAsync: checkOnboardingStatus } = trpc.auth.checkOnboardingStatus.useMutation();
	const { mutate: addTempPassword } = trpc.auth.addTempPassword.useMutation();

	const form = useForm<z.infer<typeof forgotPasswordSchema>>({
		defaultValues: {
			email: ""
		},
		resolver: zodResolver(forgotPasswordSchema)
	});

	const onCheckOnboarding = useCallback(
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
		[checkOnboardingStatus]
	);

	const onEmailSubmit = useCallback(
		async (values: EmailFormValues) => {
			setLoading(true);
			try {
				if (!isLoaded) return null;
				const exists = await checkEmail({ email: values.email });
				if (!exists) {
					toast.error("Email does not exist", {
						description: "Please enter a valid email address"
					});
				} else {
					setPasswordResetMode("password");
					setEmail(values.email);
				}
			} catch (err) {
				console.error(err);
				toast.error("Uh oh! Something went wrong.", {
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
					toast.info("Email sent!", {
						description: "Please check your email for a verification code to reset your password.",
						closeButton: true,
						duration: 1000 * 60,
						action: {
							label: "Resend",
							onClick: () =>
								void onPasswordSubmit(values).then(() => console.log("New verification code sent!"))
						}
					});
					setNewPassword(values.password);
					setPasswordResetMode("code");
				} else {
					// Something went wrong
					if (result.status === "needs_identifier") {
						form.setError("email", { message: "Invalid email address" });
					} else {
						console.log(result);
						toast.error("Email does not exist", {
							description: "There was a problem with your request."
						});
					}
				}
			} catch (error: any) {
				if (error.errors.length) {
					if (error.errors[0].message === error.errors[0].longMessage) {
						toast.error(error.errors[0].message);
					} else {
						toast.error(error.errors[0].message, {
							description: error.errors[0].longMessage
						});
					}
				} else {
					toast.error("Uh oh! Something went wrong.", {
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
		async (value: { code: string }) => {
			setCodeInputLoading(true);
			if (!isLoaded || !signIn) return null;
			try {
				const result = await signIn.attemptFirstFactor({
					strategy: "reset_password_email_code",
					code: value.code,
					password: newPassword
				});
				if (result.status === "needs_second_factor") {
					console.log("************************************************");
					console.log("2FA required!!!!");
					console.log("************************************************");
					toast.warning("2FA required!", {});
				} else if (result.status === "complete") {
					if (await onCheckOnboarding({ email, password: newPassword })) {
						await setActive({ session: result.createdSessionId });
						toast.success("Password reset successful!", {
							description: "We're logging you in..."
						});
					}
				} else {
					console.log(result);
					toast.error("Uh oh! Something went wrong.", {
						description: "There was a problem with your request."
					});
				}
			} catch (err: any) {
				console.error("error", err.errors[0].longMessage);
				toast.error(err.errors[0].message, {
					description: err.errors[0].longMessage
				});
			} finally {
				setCodeInputLoading(false);
			}
		},
		[isLoaded, newPassword, onCheckOnboarding, signIn, email]
	);

	return (
		<div className="flex grow flex-col items-center justify-center gap-12 px-4 py-8">
			<CodeInput
				opened={resetMode === "code"}
				setOpen={state => (state ? setPasswordResetMode("code") : setPasswordResetMode("password"))}
				onSubmit={onReset}
				loading={codeInputLoading}
				onResend={
					isLoaded
						? () =>
								signIn.create({
									strategy: "reset_password_email_code",
									identifier: email
								})
						: () => console.log("resending...")
				}
			/>
			<div className="relative flex  w-2/3 justify-center sm:w-1/2 lg:w-2/3">
				<img
					src="/images/white-logo.png"
					alt="genus-white"
					className="mt-0.5 sm:w-96"
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
