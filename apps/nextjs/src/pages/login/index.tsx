import {zodResolver} from "@hookform/resolvers/zod"
import Link from 'next/link';
import Image from 'next/image';
import {Button} from "@genus/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormMessage} from "@genus/ui/form";
import {Input} from "@genus/ui/input";
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {loginSchema, signupSchema} from "~/schemas";
import AuthLayout from "../../layout/AuthLayout";
import React, {ReactElement} from "react";
import type {NextPageWithLayout} from '../_app';
import {PATHS} from "~/utils";

const Login: NextPageWithLayout = () => {

    // 1. Define your form.
    const form = useForm<z.infer<typeof loginSchema>>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(loginSchema),
    })

    function onSubmit(values: z.infer<typeof loginSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        alert(JSON.stringify(values, null, 2))
    }

    return (
        <div className='flex grow flex-col items-center justify-center gap-12 px-4 py-8'>
            <Image src='/images/white-logo.svg' alt='genus-logo' width={400} height={300}/>
            <header className='w-[230px] text-center font-bold tracking-wider lg:text-4xl'>Sign in</header>
            <div className='flex flex-col space-y-12 w-1/2'>
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

