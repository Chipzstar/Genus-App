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
import pluralize from "pluralize";

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
                <span className="text-xs">
                    {thread?.comments.length ?
                        <span className="hover:underline">{thread.comments.length} {pluralize('reply', thread.comments.length)}</span> :
                        <Reply strokeWidth={1.5} size={20}/>
                    }
                </span>
            </SheetTrigger>
            <SheetContent className="w-screen sm:w-[540px]" onKeyDown={(e) => e.key === "Escape"}>
                <SheetHeader>
                    <SheetTitle>Thread <span
                        className="text-sm text-gray-500 font-normal">{message.author.firstname}</span>
                    </SheetTitle>
                    <Separator className="my-6"/>
                    <SheetDescription className="text-start">
                        <div
                            className={cn(
                                'flex flex-col space-y-2 sm:max-w-xs'
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
                                    'order-1 mr-1': currentMessageAuthor,
                                    'order-2 ml-1': !currentMessageAuthor
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
                            {thread?.comments.length && <div>
                                <span
                                    className="whitespace-nowrap leading-tight tracking-tight flex-nowrap flex items-center text-xs text-gray-500 font-normal">{`${thread.comments.length} ${pluralize('reply', thread.comments.length)}`}
                                    <hr className="ml-2 w-full"/>
                                </span>
                            </div>}
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
                                                className='flex items-center mt-1.5'>
                                                <div
                                                    className={cn('relative w-6 h-6')}>
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
                                                <span className={cn('mt-1 text-xs text-gray-400 order-2 ml-1', {
                                                    'text-gray-400/50': !isMember,
                                                })}>{formatTimestamp(c.createdAt, "distance")}</span>

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
