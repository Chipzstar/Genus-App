'use client'

import {ActiveSessionResource} from "@clerk/types"
import {cn} from '@genus/ui';
import Image from 'next/image'
import React, {useRef} from 'react'
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@genus/ui/context-menu";
import {Messages} from "~/utils/types";
import ReplyDialog from "~/components/ReplyDialog";
import {ChatBubble} from "~/components/ChatBubble";
import { formatTimestamp } from "~/utils";

interface MessagesProps {
    messages: Messages;
    chatId: string;
    session: ActiveSessionResource;
    isMember: boolean;
}

const Messages = ({
                      messages,
                      chatId,
                      session,
                      isMember
                  }: MessagesProps) => {

    const scrollDownRef = useRef<HTMLDivElement | null>(null);

    return (
        <div
            id='messages'
            className='flex h-full flex-1 flex-col-reverse gap-4 py-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
            <div ref={scrollDownRef}/>
            {messages.map((message, index) => {
                const isCurrentUser = session && message.authorId === session.user.id
                let hasNextMessageFromSameUser: boolean;
                // @ts-ignore
                hasNextMessageFromSameUser = messages[index - 1]?.authorId === messages[index].authorId;
                return (
                    <div
                        className='chat-message'
                        key={`${message.id}-${message.createdAt}`}>
                        <div
                            className={cn('flex items-end', {
                                'justify-end': isCurrentUser,
                            })}>
                            <div
                                className={cn(
                                    'flex flex-col space-y-2 max-w-xs mx-2',
                                    {
                                        'order-1 items-end': isCurrentUser,
                                        'order-2 items-start': !isCurrentUser,
                                    }
                                )}>
                                <div>
                                    <ContextMenu>
                                        <ContextMenuTrigger>
                                            <ChatBubble
                                                currentUser={isCurrentUser}
                                                member={isMember}
                                                hasNextMessageFromSameUser={hasNextMessageFromSameUser}
                                                message={message}
                                            />
                                        </ContextMenuTrigger>
                                        <ContextMenuContent updatePositionStrategy="optimized" alignOffset={5}>
                                            <ContextMenuItem>Reply</ContextMenuItem>
                                            <ContextMenuItem>React</ContextMenuItem>
                                            <ContextMenuItem>Delete</ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                    <div className={cn('flex items-center space-x-1 mt-1 text-xs text-gray-400', {
                                        'text-gray-400/50': !isMember,
                                        'justify-end': isCurrentUser,
                                        'justify-start': !isCurrentUser,
                                    })}>
                                        <span className={cn('', {
                                            'order-2 pl-1': isCurrentUser,
                                        })}>{formatTimestamp(message.createdAt)}</span>
                                        <ReplyDialog
                                            session={session}
                                            message={message}
                                            isMember={isMember}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className={cn('relative w-6 h-6', {
                                    'order-2': isCurrentUser,
                                    'order-1': !isCurrentUser,
                                    invisible: hasNextMessageFromSameUser,
                                })}>
                                <Image
                                    fill
                                    src={
                                        isCurrentUser ?
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
                    </div>
                )
            })}
        </div>
    )
}

export default Messages
