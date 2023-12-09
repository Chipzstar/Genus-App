import {zodResolver} from "@hookform/resolvers/zod"
import {Button} from "@genus/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@genus/ui/form";
import {Input} from "@genus/ui/input";
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {broad_course_categories, career_interests, genders, signupSchema} from "~/schemas";
import AuthLayout from "../../layout/AuthLayout";
import React, {ReactElement, useEffect} from "react";
import type {NextPageWithLayout} from '../_app';
import {Avatar, AvatarFallback} from "@genus/ui/avatar";
import {User} from 'lucide-react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@genus/ui/select";
import {formatString, labelEncode} from "~/utils";
import {trpc} from "~/utils/trpc";

const Signup: NextPageWithLayout = () => {
    const {error, data: universities} = trpc.auth.getUniversities.useQuery(undefined, {
        placeholderData: ['The London School of Economics and Political Science']
    })

    // 1. Define your form.
    const form = useForm<z.infer<typeof signupSchema>>({
        defaultValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmPassword: '',
            gender: 'male',
            completion_year: '',
            broad_degree_course: 'economics',
            university: 'kings-college-london',
            degree_name: '',
            career_interests: 'banking_finance'
        },
        resolver: zodResolver(signupSchema),
    })

    function onSubmit(values: z.infer<typeof signupSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        alert(JSON.stringify(values, null, 2))
    }

    return (
        <div className='flex grow flex-col items-center justify-center min-h-screen gap-y-12 md:gap-12'>
            <div className='flex flex-col space-y-4 justify-center items-center'>
                <Avatar className='h-20 w-20 lg:h-30 lg:w-30'>
                    <AvatarFallback className='bg-neutral-100'>
                        <User size={30} color='gray'/>
                    </AvatarFallback>
                </Avatar>
                <span className='lg:text-3xl'>Add profile picture</span>
            </div>
            <div className='flex flex-col space-y-12 md:w-1/2 w-full'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                        <FormLabel>Completion year</FormLabel>
                                        <FormControl>
                                            <Input {...field} className='rounded-xl'/>
                                        </FormControl>
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
                            <Button type="submit" size='lg' className='w-full h-12 font-semibold'>Complete</Button>
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

