"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {Button} from "@genus/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@genus/ui/form";
import {Input} from "@genus/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@genus/ui/select";
import {ToastAction, ToastProvider, ToastViewport} from "@genus/ui/toast";
import {useToast} from "@genus/ui/use-toast";
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {broad_course_categories, career_interests, genders, completion_years, signupSchema} from "~/schemas";
import AuthLayout from "../layout/AuthLayout";
import React, {ReactElement, useCallback, useEffect, useState} from "react";
import type {NextPageWithLayout} from './_app';
import {Avatar, AvatarFallback, AvatarImage} from "@genus/ui/avatar";
import {Mail, User, X, Check} from 'lucide-react'
import {formatString, labelEncode, PATHS} from "~/utils";
import {trpc} from "~/utils/trpc";
import {useRouter} from "next/router";
import {SignUp, useSignUp} from '@clerk/nextjs';
import CodeInput, {CodeFormValues} from "~/components/CodeInput";
import { useUploadThing } from "~/utils/uploadthing";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useDropzone } from "@uploadthing/react/hooks";


const Signup: NextPageWithLayout = () => {
    // STATE
    const [loading, setLoading] = useState(false);
    const [isOpen, setCodeVerification] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const onDrop = useCallback((acceptedFile: File[]) => {
        setFiles(acceptedFile);
    }, []);

    // HOOKS
    const {toast} = useToast();
    const router = useRouter()
    const {isLoaded, signUp, setActive} = useSignUp();
    const {error, data: universities} = trpc.auth.getUniversities.useQuery(undefined, {
        placeholderData: ['The London School of Economics and Political Science']
    })

    const form = useForm<z.infer<typeof signupSchema>>({
        defaultValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmPassword: '',
            gender: 'male',
            completion_year: '2024',
            broad_degree_course: 'economics',
            university: 'kings-college-london',
            degree_name: '',
            career_interests: 'banking_finance'
        },
        resolver: zodResolver(signupSchema),
    })

    const { startUpload, permittedFileInfo, isUploading } = useUploadThing(
        "imageUploader",
        {
            onClientUploadComplete: (res) => {
                console.log(res)
                console.log("uploaded successfully!");
            },
            onUploadError: (err) => {
                console.log(err)
                console.log("error occurred while uploading");
            },
            onUploadBegin: () => {
                console.log("UPLOAD HAS BEGUN");
            },
        },
    );

    const fileTypes = permittedFileInfo?.config
        ? Object.keys(permittedFileInfo?.config)
        : [];

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
        maxFiles: 1
    });

    const onSubmit = useCallback(async (values: z.infer<typeof signupSchema>) => {
        // ✅ This will be type-safe and validated.
        setLoading(true);
        if (!isLoaded) {
            // handle loading state
            toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem signing you up.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
            return null;
        }
        try {
            const result = await signUp.create({
                externalAccountActionCompleteRedirectUrl: "/",
                emailAddress: values.email,
                password: values.password,
                firstName: values.firstname,
                lastName: values.lastname
            });
            // Prepare the verification process for the email address.
            // This method will send a one-time code to the email address supplied to the current sign-up.
            await signUp.prepareEmailAddressVerification()
            setCodeVerification(true)
            setLoading(false);
            toast({
                title: "Email Verification Sent",
                description: 'We have sent you an email with a verification code. Please check your inbox.',
                action: <ToastAction altText="Verifiation email sent"><Mail size={20}/></ToastAction>
            });
        } catch (error) {
            setLoading(false);
            console.error(error)
            toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem signing you up.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
                duration: 5000
            })
        }
    }, [isLoaded, files, signUp]);

    useEffect(() => {
        console.table({isUploading})
    }, [isUploading])

    const confirmSignUp = useCallback(
        async (digits: CodeFormValues) => {
            setLoading(true);
            if (!isLoaded) {
                // handle loading state
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem signing you up.",
                    action: <ToastAction altText="Try again">Try again</ToastAction>,
                })
                return null;
            }
            try {
                const code = Object.values(digits).join("")
                const result = await signUp.attemptEmailAddressVerification({
                    code
                });
                await setActive({ session: result.createdSessionId });
                setCodeVerification(false)
                setLoading(false);
                toast({
                    title: "Verification successful!",
                    description: "verification-success",
                    action: <ToastAction altText="Email Verified"> <Check size={20} /> </ToastAction>,
                })
                /*if (files.length && clerk) {
                    startUpload(files).then(() => clerk.user.setProfileImage({
                        file: files[0]
                    }).then(() => console.log("profile image set")))
                });*/
                files.length && startUpload(files).then(() => console.log("profile image set", files))
                // router.push(PATHS.HOME).then(() => console.log("Navigating to Home page"));
            } catch (err: any) {
                setLoading(false);
                toast({
                    title: "Signup failed. Please try again",
                    description: err.message,
                    action: <ToastAction altText="Signup Failed"> <X size={20} /> </ToastAction>,
                })
            }
        },
        [isLoaded, router, signUp, files]
    );

    return (
        <div className='flex grow flex-col items-center justify-center min-h-screen gap-y-12 md:gap-12'>
            <CodeInput onSubmit={confirmSignUp} opened={isOpen} setOpen={setCodeVerification} loading={loading} />
            <div {...getRootProps()} role="button" className='flex flex-col space-y-4 justify-center items-center'>
                <input {...getInputProps()} />
                <Avatar className='h-20 w-20 lg:h-30 lg:w-30'>
                    <AvatarImage
                        className="AvatarImage"
                        src={files[0] ? URL.createObjectURL(files[0]) : undefined}
                        alt="Avatar Thumbnail"
                    >
                    </AvatarImage>
                    <AvatarFallback className='bg-neutral-100'>
                        <User size={30} color='gray'/>
                    </AvatarFallback>
                </Avatar>
                <span className='lg:text-3xl'>Add profile picture</span>
            </div>
            <div className='flex flex-col space-y-12 md:w-1/2 w-full'>
                <Form {...form}>
                    <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
                        <section className="grid lg:grid-cols-2 gap-x-12 gap-y-4">
                            <FormField
                                control={form.control}
                                name="firstname"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                            <Input {...field} className='rounded-xl'/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastname"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                            <Input {...field} className='rounded-xl'/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email address</FormLabel>
                                        <FormControl>
                                            <Input {...field} className='rounded-xl'/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} type='password' className='rounded-xl'/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Confirm password</FormLabel>
                                        <FormControl>
                                            <Input {...field} type='password' className='rounded-xl'/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className='rounded-xl'>
                                                    <SelectValue placeholder="Select a verified email to display"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {genders.map(gender => (
                                                    <SelectItem
                                                        key={gender}
                                                        value={gender}>{formatString(gender)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="university"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>University</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className='rounded-xl'>
                                                    <SelectValue placeholder="Select a verified email to display"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {universities?.map((university, index) => {
                                                    if (university)
                                                        return (
                                                            <SelectItem
                                                                key={index}
                                                                value={labelEncode(university)}>
                                                                {university}
                                                            </SelectItem>
                                                        )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="broad_degree_course"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Broad Degree Course</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className='rounded-xl'>
                                                    <SelectValue placeholder="Select your degree field category"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {broad_course_categories?.map((course, index) => {
                                                    if (course)
                                                        return (
                                                            <SelectItem
                                                                key={index}
                                                                value={course}>
                                                                {formatString(course)}
                                                            </SelectItem>
                                                        )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="degree_name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Degree name</FormLabel>
                                        <FormControl>
                                            <Input {...field} className='rounded-xl'/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="completion_year"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Completion Year</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className='rounded-xl'>
                                                    <SelectValue placeholder="Select your completion year"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {completion_years?.map((course, index) => {
                                                    if (course)
                                                        return (
                                                            <SelectItem
                                                                key={index}
                                                                value={course}>
                                                                {formatString(course)}
                                                            </SelectItem>
                                                        )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="career_interests"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Career interests</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className='rounded-xl'>
                                                    <SelectValue placeholder="Select a verified email to display"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {career_interests.map((career_interest, index) => (
                                                    <SelectItem key={index}
                                                                value={career_interest}>{formatString(career_interest)}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </section>
                        <div className='pt-12'>
                            <Button loading={loading} type="submit" form="signup-form" size='lg' className='w-full h-12 font-semibold'>Complete</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

Signup.getLayout = function getLayout(page: ReactElement) {
    return (
        <AuthLayout>{page}</AuthLayout>
    )
}

export default Signup;

