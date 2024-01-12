'use client'

import {ActiveSessionResource} from "@clerk/types"
import {Message} from '@genus/db';
import {cn} from '@genus/ui';
import {format} from 'date-fns';
import Image from 'next/image'
import React, {useEffect, useRef, useState} from 'react'

interface MessagesProps {
    userId: string;
    messages: Message[];
    chatId: string;
    session: ActiveSessionResource;
}

const Messages = ({
                      userId,
                      messages,
                      chatId,
                      session
                  }: MessagesProps) => {

    const scrollDownRef = useRef<HTMLDivElement | null>(null)
    const formatTimestamp = (timestamp: Date) => {
        return format(timestamp.getTime(), 'HH:mm')
    }

    return (
        <div
            id='messages'
            className='flex h-full flex-1 flex-col-reverse gap-4 py-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
            <div ref={scrollDownRef}/>
            {messages.map((message, index) => {
                const isCurrentUser = session && message.authorId === userId
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
                <span
                    className={cn('px-4 py-2 rounded-lg inline-block text-xs sm:text-base', {
                        'bg-indigo-600 text-white': isCurrentUser,
                        'bg-gray-200 text-gray-900': !isCurrentUser,
                        'rounded-br-none':
                            !hasNextMessageFromSameUser && isCurrentUser,
                        'rounded-bl-none':
                            !hasNextMessageFromSameUser && !isCurrentUser,
                    })}>
                  {message.content}
                    <span className='ml-2 text-xxs sm:text-xs text-gray-400'>
                    {formatTimestamp(message.createdAt)}
                  </span>
                </span>
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
