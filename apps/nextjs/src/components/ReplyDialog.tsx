import React from 'react';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@genus/ui/sheet";
import {Separator} from "@genus/ui/separator";
import {Message} from "~/utils/types";
import {Listbox, ListboxItem} from '@nextui-org/react';
import {Reply} from 'lucide-react';
import {ChatBubble} from "~/components/ChatBubble";
import {trpc} from "~/utils/trpc";
import {cn} from "@genus/ui";
import {formatTimestamp} from "~/utils";
import ChatInput from './ChatInput';
import {ActiveSessionResource} from "@clerk/types"
import Image from 'next/image'

interface Props {
    session: ActiveSessionResource;
    message: Message;
    isMember: boolean;
}

const ReplyDialog = ({message, isMember, session}: Props) => {
    const {data: thread} = trpc.thread.getThreadById.useQuery({
        id: message?.thread?.id as number
    }, {
        enabled: Boolean(message?.thread),
        onSuccess(data) {
            console.log(data)
        }
    });
    let currentMessageAuthor = message.authorId === session.user.id;
    return (
        <Sheet key={message.id}>
            <SheetTrigger key={message.id}>
                <span>
                    <Reply strokeWidth={1.5} size={20}/>
                </span>
            </SheetTrigger>
            <SheetContent className="w-screen sm:w-[540px]" onKeyDown={(e) => e.key === "Escape"}>
                <SheetHeader>
                    <SheetTitle>Thread <span
                        className="text-sm text-gray-500 font-normal">{message.author.firstname}</span>
                    </SheetTitle>
                    <Separator className="my-6"/>
                    <SheetDescription>
                        <div
                            className={cn(
                                'flex flex-col space-y-2 max-w-xs'
                            )}>
                            <ChatBubble
                                currentUser={currentMessageAuthor}
                                member={isMember}
                                hasNextMessageFromSameUser={false}
                                message={message}
                            />
                            <div
                                className={cn('flex items-center', {
                                    'justify-end': currentMessageAuthor,
                                })}>
                                <div className={cn('mt-1 text-xs text-gray-400', {
                                    'text-gray-400/50': !isMember,
                                    'mr-1': currentMessageAuthor,
                                    'ml-1': !currentMessageAuthor
                                })}>
                                    {formatTimestamp(message.createdAt, "distance")}
                                </div>
                                <div
                                    className={cn('relative w-6 h-6', {
                                        'order-2': currentMessageAuthor,
                                        'order-1': !currentMessageAuthor
                                    })}>
                                    <Image
                                        fill
                                        src={
                                            currentMessageAuthor ?
                                                session.user.imageUrl :
                                                message["author"].imageUrl ?
                                                    message["author"].imageUrl :
                                                    "/images/avatar-placeholder.png"
                                        }
                                        alt='Profile picture'
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                    />
                                </div>

                            </div>
                            <div>
                                <span
                                    className="whitespace-nowrap leading-tight tracking-tight flex-nowrap flex items-center text-xs text-gray-500 font-normal">{thread?.comments.length} replies
                                    <hr className="ml-2 w-full"/>
                                </span>
                            </div>
                            {thread?.comments && <Listbox
                                items={thread.comments}
                                aria-label="Dynamic Actions"
                            >
                                {(c) => {
                                    const isCurrentUser = session && c.authorId === session.user.id;
                                    return (
                                        <ListboxItem
                                            key={c.commentId}
                                        >
                                            <ChatBubble
                                                currentUser={isCurrentUser}
                                                member={isMember}
                                                hasNextMessageFromSameUser={false}
                                                message={c}
                                            />
                                            <div
                                                className={cn('flex items-center mt-1.5', {
                                                    'justify-end': isCurrentUser,
                                                })}>
                                                <span className={cn('mt-1 text-xs text-gray-400', {
                                                    'text-gray-400/50': !isMember,
                                                    'order-1 text-end mr-1': isCurrentUser,
                                                    'order-2 text-start ml-1': !isCurrentUser,
                                                })}>{formatTimestamp(c.createdAt, "distance")}</span>
                                                <div
                                                    className={cn('relative w-6 h-6', {
                                                        'order-2': isCurrentUser,
                                                        'order-1': !isCurrentUser
                                                    })}>
                                                    <Image
                                                        fill
                                                        src={
                                                            isCurrentUser ?
                                                                session.user.imageUrl :
                                                                c["author"].imageUrl ?
                                                                    c["author"].imageUrl :
                                                                    "/images/avatar-placeholder.png"
                                                        }
                                                        alt='Profile picture'
                                                        referrerPolicy='no-referrer'
                                                        className='rounded-full'
                                                    />
                                                </div>
                                            </div>
                                        </ListboxItem>
                                    );
                                }}
                            </Listbox>
                            }
                        </div>
                        {thread?.threadId ? (
                            <ChatInput
                                type="reply"
                                replyType="comment"
                                chatId={thread.threadId}
                                isMember={isMember}
                                message={message}
                            />
                        ) : (
                            <ChatInput
                                type="reply"
                                replyType="thread"
                                isMember={isMember}
                                message={message}
                            />)}
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

export default ReplyDialog;
