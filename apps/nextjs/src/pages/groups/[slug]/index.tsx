import React, {ReactElement, useMemo} from 'react';
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
import {GroupStatusButton} from "~/components/GroupStatusButton";
import router from 'next/router';

export const getServerSideProps = (async (ctx) => {
    const params = ctx.params
    return {
        props: {
            ...params
        } // will be passed to the page component as props
    }
}) satisfies GetServerSideProps

const GroupSlug = (props: any) => {
    const {toast} = useToast()
    const utils = trpc.useUtils();
    const {signOut} = useClerk()
    const {isSignedIn, session} = useSession()

    const {mutate: joinGroup} = trpc.group.joinGroup.useMutation({
        onSuccess(data) {
            console.log(data);
            utils.group.invalidate();
            toast({
                title: "Yayy! You're now in the group! 🎉",
                description: "You can now post to the chat and ask questions",
            })
        },
        onError(error) {
            console.log(error)
            toast({
                title: error.message,
                description: error.message,
                duration: 5000
            })
        }
    })
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
    });

    const {isMember, btnText, onClick, textSize} = useMemo(() => {
        if (group?.members.find(m => m.userId === session?.user.id)) {
            return {
                isMember: true,
                btnText: "Members",
                onClick: (e: React.MouseEvent<HTMLButtonElement>) => router.push(`/groups/${group.slug}/members`),
                textSize: "text-base"
            }
        }
        return {
            isMember: false,
            btnText: "Join",
            onClick: (e: React.MouseEvent<HTMLButtonElement>) => joinGroup({slug: props.slug}),
            textSize: "text-xl sm:text-2xl"
        }
    }, [group?.members, session?.user.id, group?.slug, joinGroup, props.slug]);

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
                {!isLoading && <GroupStatusButton
                    title={btnText}
                    onClick={onClick}
                    textSize={textSize}
                />}
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
                            chatId={group.groupId}
                            messages={group.messages}
                            session={session}
                            isMember={isMember}
                        />}
                        <ChatInput type="message" chatId={group.groupId} isMember={isMember}/>
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
