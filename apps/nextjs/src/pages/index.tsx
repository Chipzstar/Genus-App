import type {NextPage} from 'next';
import Head from 'next/head';
import {trpc} from '../utils/trpc';
import {zodResolver} from "@hookform/resolvers/zod"
import {useAuth, UserButton} from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import {Button} from "@genus/ui/button";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@genus/ui/form";
import {Input} from "@genus/ui/input";
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {signupSchema} from "~/schemas";

const Home: NextPage = () => {
    const postQuery = trpc.post.all.useQuery();

    // 1. Define your form.
    const form = useForm<z.infer<typeof signupSchema>>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            gender: 'male',
            completion_year: '',
            university: '',
            degree_course: '',
            career_interests: ''
        },
        resolver: zodResolver(signupSchema),
    })

    function onSubmit(values: z.infer<typeof signupSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        alert(JSON.stringify(values, null, 2))
    }

    return (
        <>
            <Head>
                <title>Genus Networks</title>
                <meta
                    name='description'
                    content='Genus is a careers social and content platform that seeks to ‘liven’ and‘level up’ career support for students and recent graduates by connecting them to successful applicants /professionals and eachother in an accessible and casualised way'
                />
            </Head>
            <main className='from-primary flex h-screen flex-col items-center bg-gradient-to-b to-[#15162c] text-white'>
                <div className='flex grow flex-col items-center justify-center gap-12 px-4 py-8'>
                    <Image src='/images/white-logo.svg' alt='genus-logo' width={500} height={500}/>
                    <header className='w-[230px] text-center font-bold tracking-wider lg:text-4xl'>Sign in</header>
                    <div className='flex flex-col space-y-12 text-black'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Email address" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Password" {...field} type='password'/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;

const AuthShowcase: React.FC = () => {
    const {isSignedIn} = useAuth();
    const {data: secretMessage} = trpc.auth.getSecretMessage.useQuery(undefined, {enabled: !!isSignedIn});

    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            {isSignedIn && (
                <>
                    <p className='text-center text-2xl text-white'>
                        {secretMessage && (
                            <span>
                                {' '}
                                {secretMessage} click the user button!
                                <br/>
                            </span>
                        )}
                    </p>
                    <div className='flex items-center justify-center'>
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: {
                                        width: '3rem',
                                        height: '3rem'
                                    }
                                }
                            }}
                        />
                    </div>
                </>
            )}
            {!isSignedIn && (
                <p className='text-center text-2xl text-white'>
                    <Link href='/sign-in'>Sign In</Link>
                </p>
            )}
        </div>
    );
};
