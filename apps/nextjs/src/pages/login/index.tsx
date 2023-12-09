"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import Link from 'next/link';
import Image from 'next/image';
import {Button} from "@genus/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage
} from "@genus/ui/form";
import {Input} from "@genus/ui/input";
import { useToast } from "@genus/ui/use-toast"
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {loginSchema, signupSchema} from "~/schemas";
import AuthLayout from "../../layout/AuthLayout";
import React, {ReactElement, useCallback} from "react";
import { SignIn, useSignIn } from '@clerk/nextjs';
import type {NextPageWithLayout} from '../_app';
import {PATHS} from "~/utils";
import { useRouter } from "next/router";
import { ToastAction } from "@genus/ui/toast";
import {trpc} from "~/utils/trpc";

const Login: NextPageWithLayout = () => {
    const { isLoaded, signIn, setActive } = useSignIn();
    const { toast } = useToast()
    const [loading, setLoading] = React.useState(false);

    const router = useRouter();
    // 1. Define your form.
    const form = useForm<z.infer<typeof loginSchema>>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = useCallback(async (values: z.infer<typeof loginSchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            setLoading(true);
            if (!isLoaded) {
                // handle loading state
                return null;
            }
            console.log(values)
            const result = await signIn.create({
                identifier: values.email,
                password: values.password
            });
            if (result.status === 'complete' && !!result.createdSessionId) {
                // @ts-ignore
                await setActive({ session: result.createdSessionId });
                await router.replace('/');
                return;
            } else {
                // Something went wrong
                if (result.status === 'needs_identifier') {
                    form.setError('email', {message: 'Invalid email address'});
                } else if (result.status === 'needs_first_factor') {
                    form.setError('password', {message: 'Password is incorrect'});
                } else {
                    toast({
                        title: "Password is incorrect",
                        description: "There was a problem with your request.",
                        action: <ToastAction altText="Try again">Try again</ToastAction>,
                    })
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
            toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    }, [isLoaded])

    return (
        <div className='flex grow flex-col items-center justify-center gap-12 px-4 py-8'>
            <Image src='/images/white-logo.svg' alt='genus-logo' width={400} height={300}/>
            <header className='w-[230px] text-center font-bold tracking-wider text-2xl lg:text-4xl'>Sign in</header>
            <div className='flex flex-col space-y-12 md:w-1/2 w-full'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Email address" {...field} className='md:h-12'/>
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
                                    <FormControl>
                                        <Input placeholder="Password" {...field} className='md:h-12' type='password'/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className='flex justify-end'>
                            <Link href={PATHS.FORGOT_PASSWORD}>Forgot Password?</Link>
                        </div>
                        <div className='flex flex-col items-center space-y-4'>
                            <Button type="submit" size='lg' className='w-full h-12 font-semibold'>Login</Button>
                            <FormDescription className='text-white font-light'>{"Don't have an account?"}
                                <Link
                                    className='font-semibold'
                                    href={PATHS.SIGNUP}>
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
    return (
        <AuthLayout>{page}</AuthLayout>
    )
}

export default Login;

