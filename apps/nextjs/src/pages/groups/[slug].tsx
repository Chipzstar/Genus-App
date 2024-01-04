import React, {ReactElement, useEffect} from 'react';
import AppLayout from "~/layout/AppLayout";
import {Button} from "@genus/ui/button";
import { Navbar, NavbarBrand} from '@nextui-org/react';
import Image from 'next/image';
import {useClerk, useSession} from '@clerk/nextjs';
import { ThreeDots } from 'react-loader-spinner';
import {GetServerSideProps} from 'next';
import {trpc} from '~/utils/trpc';
import Messages from "~/components/Messages";
import {Alert, AlertDescription, AlertTitle} from "@genus/ui/alert";
import ChatInput from "~/components/ChatInput";

export const getServerSideProps = (async (ctx) => {
    const params = ctx.params
    return {
        props: {
            ...params
        } // will be passed to the page component as props
    }
}) satisfies GetServerSideProps

const GroupSlug = (props: any) => {
    const {signOut} = useClerk()
    const {isSignedIn, session} = useSession()

    const {isLoading, data: group, failureReason, error} = trpc.group.getGroupBySlug.useQuery({
        slug: props.slug
    }, {
        onSuccess: (data) => {
            console.log(data)
        }
    })

    return (
        <div className='sm:h-container mx-auto max-w-3xl text-primary pt-4 flex flex-col'>
            <Navbar classNames={{
                base: 'py-3',
                brand: 'w-full flex items-center space-x-4',
            }}>
                <NavbarBrand>
                    <Image src='/images/spring-weeks-ldn.svg' alt='genus-white' width={100} height={75}/>
                    <span className="text-white text-2xl font-semibold">InternGen: Spring into Banking</span>
                </NavbarBrand>
                <div className='right-5 px-4 self-end'>
                    <Button onClick={(e) => signOut()}>Logout</Button>
                </div>
            </Navbar>
            {isLoading ? (
                    <div className='flex grow justify-center items-center p-6 sm:px-12'>
                        <div className="text-white">
                            <ThreeDots
                                visible={true}
                                height="80"
                                width="80"
                                color="white"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </div>
                    </div>
                ) :
                group ? (
                    <div className='flex grow flex-col bg-white p-6 sm:px-12'>
                        {isSignedIn && <Messages
                            userId={session.user.id}
                            chatId={group.groupId}
                            messages={group.messages ?? []}
                        />}
                        <ChatInput chatId={group.groupId}/>
                    </div>
                ) : <div className='h-full p-6 sm:px-12'>
                    <Alert>
                        <AlertTitle>Oops!</AlertTitle>
                        <AlertDescription>
                            {failureReason?.message ?? error?.message}
                        </AlertDescription>
                    </Alert>
                </div>}
        </div>
    );
};

GroupSlug.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>{page}</AppLayout>
    )
}

export default GroupSlug;
