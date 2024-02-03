"use client";

import type { ReactElement } from "react";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "@uploadthing/react/hooks";
import { Check, Mail, User, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { generateClientDropzoneAccept } from "uploadthing/client";
import type { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@genus/ui/avatar";
import { Button } from "@genus/ui/button";
import { Checkbox } from "@genus/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@genus/ui/select";
import { ToastAction } from "@genus/ui/toast";
import { useToast } from "@genus/ui/use-toast";
import { completion_years, signupSchema } from "@genus/validators";
import { broad_course_categories, career_interests, genders, universities } from "@genus/validators/constants";

import type { CodeFormValues } from "~/components/CodeInput";
import CodeInput from "~/components/CodeInput";
import { formatString } from "~/utils";
import { useUploadThing } from "~/utils/uploadthing";
import AuthLayout from "../layout/AuthLayout";
import type { NextPageWithLayout } from "./_app";

const Signup: NextPageWithLayout = () => {
	// STATE
	const [loading, setLoading] = useState(false);
	const [isOpen, setCodeVerification] = useState(false);
	const [files, setFiles] = useState<File[]>([]);
	const onDrop = useCallback((acceptedFile: File[]) => {
		setFiles(acceptedFile);
	}, []);

	// HOOKS
	const { toast } = useToast();
	const router = useRouter();
	const { isLoaded, signUp, setActive } = useSignUp();

	const form = useForm<z.infer<typeof signupSchema>>({
		defaultValues: {
			firstname: "",
			lastname: "",
			email: "",
			password: "",
			confirmPassword: "",
			gender: "male",
			completion_year: "2024",
			broad_degree_course: "economics",
			university: "king's-college-london",
			degree_name: "",
			career_interests: []
		},
		resolver: zodResolver(signupSchema)
	});

	const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
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

	const fileTypes = permittedFileInfo?.config ? Object.keys(permittedFileInfo?.config) : [];

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
		maxFiles: 1
	});

	const onSubmit = useCallback(
		async (values: z.infer<typeof signupSchema>) => {
			// ✅ This will be type-safe and validated.
			setLoading(true);
			if (!isLoaded) {
				// handle loading state
				toast({
					title: "Uh oh! Something went wrong.",
					description: "There was a problem signing you up.",
					action: <ToastAction altText="Try again">Try again</ToastAction>
				});
				return null;
			}
			try {
				const { email, password, firstname, lastname, confirmPassword, ...rest } = values;
				const result = await signUp.create({
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
				toast({
					title: "Email Verification Sent",
					description: "We have sent you an email with a verification code. Please check your inbox.",
					action: (
						<ToastAction altText="Verifiation email sent">
							<Mail size={20} />
						</ToastAction>
					)
				});
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
		[isLoaded, files]
	);

	const confirmSignUp = useCallback(
		async (digits: CodeFormValues) => {
			setLoading(true);
			if (!isLoaded) {
				// handle loading state
				toast({
					title: "Uh oh! Something went wrong.",
					description: "There was a problem signing you up.",
					action: <ToastAction altText="Try again">Try again</ToastAction>
				});
				return null;
			}
			try {
				const code = Object.values(digits).join("");
				const result = await signUp.attemptEmailAddressVerification({
					code
				});
				await setActive({ session: result.createdSessionId });
				setCodeVerification(false);
				setLoading(false);
				toast({
					title: "Verification successful!",
					description: "verification-success",
					action: (
						<ToastAction altText="Email Verified">
							{" "}
							<Check size={20} />{" "}
						</ToastAction>
					)
				});
				files.length &&
					setTimeout(() => startUpload(files).then(() => console.log("profile image set", files)), 1000);
				// router.push(PATHS.HOME).then(() => console.log("Navigating to Home page"));
			} catch (err: any) {
				setLoading(false);
				toast({
					title: "Signup failed. Please try again",
					description: err.message,
					action: (
						<ToastAction altText="Signup Failed">
							{" "}
							<X size={20} />{" "}
						</ToastAction>
					)
				});
			}
		},
		[isLoaded, router, signUp, files]
	);

	return (
		<div className="flex min-h-screen grow flex-col items-center justify-center gap-y-12 md:gap-12">
			<CodeInput onSubmit={confirmSignUp} opened={isOpen} setOpen={setCodeVerification} loading={loading} />
			<div {...getRootProps()} role="button" className="flex flex-col items-center justify-center space-y-4">
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
							<FormField
								control={form.control}
								name="gender"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Gender</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="rounded-xl">
													<SelectValue placeholder="Select a verified email to display" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{genders.map(gender => (
													<SelectItem key={gender} value={gender}>
														{formatString(gender)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="university"
								render={({ field }) => (
									<FormItem>
										<FormLabel>University</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="rounded-xl">
													<SelectValue placeholder="Select a verified email to display" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{universities?.map((university, index) => {
													if (university)
														return (
															<SelectItem key={index} value={university}>
																{formatString(university)}
															</SelectItem>
														);
												})}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="broad_degree_course"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Broad Degree Course</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="rounded-xl">
													<SelectValue placeholder="Select your degree field category" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{broad_course_categories?.map((course, index) => {
													if (course)
														return (
															<SelectItem key={index} value={course}>
																{formatString(course)}
															</SelectItem>
														);
												})}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="degree_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Degree name</FormLabel>
										<FormControl>
											<Input {...field} className="rounded-xl" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="completion_year"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Completion Year</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="rounded-xl">
													<SelectValue placeholder="Select your completion year" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{completion_years?.map((course, index) => {
													if (course)
														return (
															<SelectItem key={index} value={course}>
																{formatString(course)}
															</SelectItem>
														);
												})}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="career_interests"
								render={() => (
									<FormItem>
										<FormLabel>Career interests</FormLabel>
										<FormDescription className="text-neutral-600">
											Select all that apply
										</FormDescription>
										<div className="space-y-2 sm:flex sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
											{career_interests.map((item, index) => (
												<FormField
													key={index}
													control={form.control}
													name="career_interests"
													render={({ field }) => {
														return (
															<FormItem
																key={index}
																className="flex flex-row items-start space-x-3 space-y-0"
															>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(item)}
																		onCheckedChange={(checked: boolean) => {
																			return checked
																				? field.onChange([...field.value, item])
																				: field.onChange(
																						field.value?.filter(
																							value => value !== item
																						)
																					);
																		}}
																	/>
																</FormControl>
																<FormLabel className="whitespace-nowrap font-normal">
																	{formatString(item)}
																</FormLabel>
															</FormItem>
														);
													}}
												/>
											))}
										</div>
										<FormMessage className="text-red-500/75" />
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
								Complete
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

Signup.getLayout = function getLayout(page: ReactElement) {
	return <AuthLayout>{page}</AuthLayout>;
};

export default Signup;
