import type {NextPage} from 'next';
import Head from 'next/head';
import {trpc} from '../utils/trpc';
import { zodResolver } from "@hookform/resolvers/zod"
import type {inferProcedureOutput} from '@trpc/server';
import type {AppRouter} from '@genus/api';
import {useAuth, UserButton} from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@genus/ui/button";
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@genus/ui/card";
import {useForm} from 'react-hook-form';
import { z } from 'zod';
import { BellRing, Check } from "lucide-react"
import {Switch} from "@genus/ui/switch";
import { cn } from "@genus/ui";

/*const PostCard: React.FC<{
    post: inferProcedureOutput<AppRouter['post']['all']>[number];
}> = ({post}) => {
    return (
        <div className='max-w-2xl rounded-lg border-2 border-gray-500 p-4 transition-all hover:scale-[101%]'>
            <h2 className='text-2xl font-bold text-[hsl(280,100%,70%)]'>{post.title}</h2>
            <p>{post.content}</p>
        </div>
    );
};*/

const notifications = [
    {
        title: "Your call has been confirmed.",
        description: "1 hour ago",
    },
    {
        title: "You have a new message!",
        description: "1 hour ago",
    },
    {
        title: "Your subscription is expiring soon!",
        description: "2 hours ago",
    },
]

const Home: NextPage = () => {
    const postQuery = trpc.post.all.useQuery();

    const formSchema = z.object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
    })

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
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
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="shadcn" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public display name.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </div>
                    <div className='flex justify-center'>
                        <Card className={cn("w-[380px]")}>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>You have 3 unread messages.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className=" flex items-center space-x-4 rounded-md border p-4">
                                    <BellRing />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Push Notifications
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Send notifications to device.
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                                <div>
                                    {notifications.map((notification, index) => (
                                        <div
                                            key={index}
                                            className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                        >
                                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {notification.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">
                                    <Check className="mr-2 h-4 w-4" /> Mark all as read
                                </Button>
                            </CardFooter>
                        </Card>
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
