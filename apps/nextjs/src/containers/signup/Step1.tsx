import type { FC } from "react";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useClerk, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "@uploadthing/react";
import { Check, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { generateClientDropzoneAccept } from "uploadthing/client";
import type { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";
import { Button } from "@genus/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import { useStepper } from "@genus/ui/stepper";
import { signupStep1Schema } from "@genus/validators";

import CodeInput from "~/components/CodeInput";
import { useUploadThing } from "~/utils/uploadthing";

interface Props {
	step?: number;
}

const Step1: FC<Props> = ({}) => {
	// STATE
	const { nextStep } = useStepper();
	const [loading, setLoading] = useState(false);
	const [isOpen, setCodeVerification] = useState(false);
	const clerk = useClerk();
	const [files, setFiles] = useState<File[]>([]);
	const onDrop = useCallback((acceptedFile: File[]) => {
		setFiles(acceptedFile);
	}, []);

	// HOOKS
	const router = useRouter();
	const { isLoaded, signUp, setActive } = useSignUp();

	const form = useForm<z.infer<typeof signupStep1Schema>>({
		defaultValues: {
			firstname: "",
			lastname: "",
			email: "",
			password: "",
			confirmPassword: ""
		},
		resolver: zodResolver(signupStep1Schema)
	});

	const { permittedFileInfo } = useUploadThing("signupUploader", {
		onClientUploadComplete: res => {
			console.log(res);
			console.log("uploaded successfully!");
		},
		onUploadError: err => {
			console.log(err);
			console.log("error occurred while uploading");
		},
		onUploadBegin: filename => {
			console.log("UPLOAD HAS BEGUN", filename);
		}
	});

	const fileTypes = permittedFileInfo?.config ? Object.keys(permittedFileInfo.config) : [];

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
		maxFiles: 1
	});

	const onSubmit = useCallback(
		async (values: z.infer<typeof signupStep1Schema>) => {
			// ✅ This will be type-safe and validated.
			setLoading(true);
			if (!isLoaded) {
				// handle loading state
				toast.error("Uh oh! Something went wrong.", {
					description: "There was a problem signing you up.",
					action: {
						label: "Try again",
						onClick: () => void onSubmit(values)
					}
				});
				return null;
			}
			try {
				const { email, password, firstname, lastname, confirmPassword: _, ...rest } = values;
				await signUp.create({
					externalAccountActionCompleteRedirectUrl: "/",
					emailAddress: email,
					password,
					firstName: firstname,
					lastName: lastname,
					unsafeMetadata: {
						...rest
					}
				});
				// Prepare the verification process for the email address.
				// This method will send a one-time code to the email address supplied to the current sign-up.
				await signUp.prepareEmailAddressVerification();
				setCodeVerification(true);
				toast.info("Email Verification Sent", {
					description: "We have sent you an email with a verification code. Please check your inbox.",
					icon: <Mail size={20} />
				});
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
		[isLoaded, files]
	);

	const confirmSignUp = useCallback(
		async (values: { code: string }) => {
			setLoading(true);
			if (!isLoaded) {
				// handle loading state
				toast.error("Uh oh! Something went wrong.", {
					description: "There was a problem signing you up."
				});
				return null;
			}
			try {
				const result = await signUp.attemptEmailAddressVerification({
					code: values.code
				});
				setTimeout(() => {
					setActive({ session: result.createdSessionId })
						.then(() => {
							setCodeVerification(false);
							setLoading(false);
							toast.success("Welcome to Genus!", {
								description: "Your account has been verified",
								icon: <Check size={20} />
							});
							if (files.length) {
								setTimeout(
									_clerk => {
										_clerk?.user &&
											void _clerk.user
												.setProfileImage({
													file: files[0]!
												})
												.then(() => console.log("profile image set in Clerk"))
												.catch(err => console.error(err));
									},
									1500,
									clerk
								);
							}
						})
						.catch(err => console.error(err));
				}, 1000);
				// router.push(PATHS.HOME).then(() => console.log("Navigating to Home page"));
			} catch (err: any) {
				setLoading(false);
				toast.error("Signup failed. Please try again", {
					description: err.message
				});
			}
		},
		[isLoaded, router, signUp, files, clerk]
	);
	return (
		<>
			<CodeInput
				onSubmit={confirmSignUp}
				opened={isOpen}
				setOpen={setCodeVerification}
				loading={loading}
				onResend={isLoaded ? () => signUp.prepareEmailAddressVerification() : () => console.log("resending...")}
			/>
			<div {...getRootProps()} role="button" className="mb-4 flex flex-col items-center justify-center space-y-4">
				<input {...getInputProps()} />
				<Avatar className="lg:h-30 lg:w-30 h-20 w-20">
					<AvatarImage
						className="AvatarImage"
						src={files[0] ? URL.createObjectURL(files[0]) : undefined}
						alt="Avatar Thumbnail"
					></AvatarImage>
					<AvatarFallback className="bg-neutral-100">
						<User size={30} color="gray" />
					</AvatarFallback>
				</Avatar>
				<span className="lg:text-3xl">Add profile picture</span>
			</div>
			<div className="flex w-full flex-col space-y-12 md:w-1/2">
				<Form {...form}>
					<form id="signup-form" onSubmit={form.handleSubmit(values => nextStep())}>
						<section className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
							<FormField
								control={form.control}
								name="firstname"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First name</FormLabel>
										<FormControl>
											<Input {...field} className="rounded-xl" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastname"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last name</FormLabel>
										<FormControl>
											<Input {...field} className="rounded-xl" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input {...field} className="rounded-xl" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email address</FormLabel>
										<FormControl>
											<Input {...field} className="rounded-xl" />
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
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input {...field} type="password" className="rounded-xl" />
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
										<FormLabel>Confirm password</FormLabel>
										<FormControl>
											<Input {...field} type="password" className="rounded-xl" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</section>
						<div className="pt-6 sm:pt-12">
							<Button
								loading={loading}
								type="submit"
								form="signup-form"
								size="lg"
								className="h-12 w-full font-semibold"
							>
								Continue
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
};

export default Step1;
