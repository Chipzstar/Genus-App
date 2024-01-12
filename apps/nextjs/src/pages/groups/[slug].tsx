import React, {ReactElement} from 'react';
import AppLayout from "~/layout/AppLayout";
import {Navbar, NavbarBrand} from '@nextui-org/react';
import Image from 'next/image';
import {useClerk, useSession} from '@clerk/nextjs';
import {ThreeDots} from 'react-loader-spinner';
import {GetServerSideProps} from 'next';
import {trpc} from '~/utils/trpc';
import Messages from "~/components/Messages";
import {Alert, AlertDescription, AlertTitle} from "@genus/ui/alert";
import ChatInput from "~/components/ChatInput";
import {useToast} from "@genus/ui/use-toast";
import {LogoutButton} from "~/components/LogoutButton";

export const getServerSideProps = (async (ctx) => {
    const params = ctx.params
    return {
        props: {
            ...params
        } // will be passed to the page component as props
    }
}) satisfies GetServerSideProps

const GroupSlug = (props: any) => {
    const { toast } = useToast()
    const {signOut} = useClerk()
    const {isSignedIn, session} = useSession()

    const {isLoading, data: group, failureReason, error} = trpc.group.getGroupBySlug.useQuery({
        slug: props.slug
    }, {
        onSuccess: (data) => {
            console.log(data)
        },
        onError: (error) => {
            toast({
                title: error?.data?.code ?? "Oops!",
                description: error.message,
                duration: 3000
            })
        }
    })

    return (
        <div className='sm:h-container mx-auto max-w-3xl text-primary pt-4 flex flex-col overflow-y-hidden'>
            <Navbar classNames={{
                base: 'px-3 sm:px-0 py-3',
                brand: 'w-full flex items-center space-x-4',
            }}>
                <NavbarBrand>
                    <Image src='/images/spring-weeks-ldn.svg' alt='genus-white' width={100} height={75}/>
                    <span className="text-white text-lg sm:text-2xl font-semibold whitespace-pre-wrap">InternGen: Spring into Banking</span>
                </NavbarBrand>
                <LogoutButton onClick={(e) => signOut()}/>
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
                    <div className='chat-wrapper'>
                        {isSignedIn && <Messages
                            userId={session.user.id}
                            chatId={group.groupId}
                            messages={group.messages ?? []}
                            session={session}
                        />}
                        <ChatInput chatId={group.groupId}/>
                    </div>
                ) : <div className='h-full flex flex-col justify-center p-6 sm:px-12'>
                    <Alert variant="destructive" className="text-center">
                        <AlertTitle>Group does not exist!</AlertTitle>
                        <AlertDescription>
                            {failureReason ? failureReason.message : error ? error?.message : "Please check you are using the right URL"}
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
