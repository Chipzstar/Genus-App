import type { FC } from "react";
import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useClerk, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "@uploadthing/react";
import { Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { generateClientDropzoneAccept } from "uploadthing/client";
import type { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";
import { Button } from "@genus/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import { useStepper } from "@genus/ui/stepper";
import { signupStep1Schema } from "@genus/validators";
import { encryptString } from "@genus/validators/helpers";

import CodeInput from "~/components/CodeInput";
import { env } from "~/env";
import { PATHS } from "~/utils";
import type { UserState } from "~/utils/types";
import { useUploadThing } from "~/utils/uploadthing";

interface Props {
	step?: number;
}

const { NEXT_PUBLIC_AXIOM_TOKEN } = env;

const Step1: FC<Props> = () => {
	// STATE
	const { setContext, nextStep } = useStepper<UserState>();
	const [loading, setLoading] = useState(false);
	const [isOpen, setCodeVerification] = useState(false);
	const clerk = useClerk();
	const [files, setFiles] = useState<File[]>([]);
	const onDrop = useCallback((acceptedFile: File[]) => {
		setFiles(acceptedFile);
	}, []);

	// HOOKS
	const { isLoaded, signUp, setSession } = useSignUp();

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
				const { email, username, password, firstname, lastname, confirmPassword: _ } = values;
				await signUp.create({
					externalAccountActionCompleteRedirectUrl: "/",
					emailAddress: email,
					password,
					firstName: firstname,
					lastName: lastname,
					unsafeMetadata: {
						username,
						tempPassword: encryptString(password, NEXT_PUBLIC_AXIOM_TOKEN)
					}
				});
				// Prepare the verification process for the email address.
				// This method will send a one-time code to the email address supplied to the current sign-up.
				await signUp.prepareEmailAddressVerification();
				setContext({
					email: values.email,
					name: `${values.firstname} ${values.lastname}`
				});
				setCodeVerification(true);
				toast.info("Email Verification Sent", {
					description: "We have emailed you a verification code. Please check your inbox.",
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
		[isLoaded, signUp, setContext]
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
				await signUp.attemptEmailAddressVerification({
					code: values.code
				});
				setTimeout(() => {
					setCodeVerification(false);
					setLoading(false);
					if (files.length) {
						setTimeout(
							_clerk => {
								console.log(_clerk);
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
					nextStep();
					void clerk.signOut();
				}, 1000);
			} catch (err: any) {
				setLoading(false);
				toast.error("Signup failed. Please try again", {
					description: err.message
				});
			}
		},
		[isLoaded, signUp, files, nextStep, clerk]
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
					<form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
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
						<div className="flex flex-col items-center space-y-4 pt-6 sm:pt-12">
							<Button
								loading={loading}
								type="submit"
								form="signup-form"
								size="lg"
								radius="xl"
								className="w-64 text-lg font-semibold sm:w-full sm:text-xl"
							>
								Continue
							</Button>
							<FormDescription className="font-light text-white">
								{"Already have an account?"}
								<Link className="font-semibold" href={PATHS.LOGIN}>
									&nbsp;Login here
								</Link>
							</FormDescription>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
};

export default Step1;
