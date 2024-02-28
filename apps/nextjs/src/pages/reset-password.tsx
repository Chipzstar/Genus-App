import React, { ReactElement, useCallback, useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useWindowSize } from "usehooks-ts";
import * as z from "zod";

import { forgotPasswordSchema } from "@genus/validators";

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
	const { width = 0, height = 0 } = useWindowSize();
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
				} else if (result.status === "complete") {
					await setActive({ session: result.createdSessionId });
					toast.success("Password reset successful!", {
						description: "We're logging you in..."
					});
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
			<div className="relative flex h-[250px] w-2/3 justify-center sm:w-1/2 lg:w-2/3">
				<object
					className="overflow-visible"
					type="image/svg+xml"
					data="/images/logo-white.svg"
					width={width <= 480 ? 300 : 450}
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
