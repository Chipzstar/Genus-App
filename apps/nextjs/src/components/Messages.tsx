'use client'

import type {ActiveSessionResource} from '@clerk/types'
import {cn} from '@genus/ui'
import Image from 'next/image'
import React, {useRef} from 'react'
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from '@genus/ui/context-menu'
import {Messages} from '~/utils/types'
import ReplyDialog from '~/components/ReplyDialog'
import {ChatBubble} from '~/components/ChatBubble'
import {formatTimestamp} from '~/utils'
import EmojiDialog from '~/components/EmojiDialog'

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

    const scrollDownRef = useRef<HTMLDivElement | null>(null)
    return (
      <div
        id="messages"
        className="flex h-full flex-1 flex-col-reverse gap-4 py-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
          <div ref={scrollDownRef} />
          {messages.map((message, index) => {
              const isCurrentUser = session && message.authorId === session.user.id
              const prevMessage = messages[index - 1]
              let hasNextMessageFromSameUser: boolean
              // @ts-expect-error messages[index] is always defined
              const {authorId} = messages[index]
              // eslint-disable-next-line prefer-const
              hasNextMessageFromSameUser = prevMessage?.authorId === authorId
              return (
                <div
                  className="chat-message"
                  key={`${message.id}`}>
                    <div
                      className={cn('flex items-end', {
                          'justify-end': isCurrentUser
                      })}>
                        <div
                          className={cn(
                            'flex flex-col space-y-2 max-w-xs mx-2',
                            {
                                'order-1 items-end': isCurrentUser,
                                'order-2 items-start': !isCurrentUser
                            }
                          )}>
                            <div>
                                <ContextMenu>
                                    <ContextMenuTrigger>
                                        <ChatBubble
                                          currentUser={isCurrentUser}
                                          member={isMember}
                                          hasNextMessageFromSameUser={hasNextMessageFromSameUser}
                                          message={{...message, type: 'message'}}
                                        />
                                    </ContextMenuTrigger>
                                    <ContextMenuContent updatePositionStrategy="optimized" alignOffset={5}>
                                        <ContextMenuItem>{message.id}</ContextMenuItem>
                                        <ContextMenuItem>React</ContextMenuItem>
                                        <ContextMenuItem>Delete</ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                                <div
                                  className={cn('flex w-full items-center space-x-2 mt-1 text-xs text-gray-400', {
                                      'text-gray-400/50': !isMember,
                                      'justify-end': isCurrentUser,
                                      'justify-start': !isCurrentUser
                                  })}>
                                        <span className={cn('', {
                                            'order-2 pl-1': isCurrentUser
                                        })}>{formatTimestamp(message.createdAt)}</span>
                                    <div className="flex items-center">
                                        <ReplyDialog
                                          session={session}
                                          message={message}
                                          isMember={isMember}
                                        />
                                        <EmojiDialog type="message" isCurrentUser={isCurrentUser} message={message} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                          className={cn('relative w-6 h-6', {
                              'order-2': isCurrentUser,
                              'order-1': !isCurrentUser,
                              invisible: hasNextMessageFromSameUser
                          })}>
                            <Image
                              fill
                              src={
                                  isCurrentUser ?
                                    session.user.imageUrl :
                                    message.author.imageUrl ?
                                      message.author.imageUrl :
                                      '/images/avatar-placeholder.png'
                              }
                              alt="Profile picture"
                              referrerPolicy="no-referrer"
                              className="rounded-full"
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
