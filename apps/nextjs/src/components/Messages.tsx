"use client";

import React, { forwardRef, useRef } from "react";
import Image from "next/image";
import { useSession } from "@clerk/nextjs";

import { cn } from "@genus/ui";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@genus/ui/context-menu";

import { ChatBubble } from "~/components/ChatBubble";
import EmojiDialog from "~/components/EmojiDialog";
import ReplyDialog from "~/components/ReplyDialog";
import { formatTimestamp } from "~/utils";
import type { Messages } from "~/utils/types";

interface MessagesProps {
	messages: Messages;
	chatId: string;
	isMember: boolean;
}

const Messages = forwardRef<HTMLDivElement | null, MessagesProps>(({ messages, isMember }, ref) => {
	const { session } = useSession();

	return (
		<div
			ref={ref}
			id="messages"
			className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto py-3"
		>
			<div />
			{messages.map((message, index: number) => {
				const isCurrentUser = !!session && message.authorId === session.user.id;
				const prevMessage = messages[index - 1];
				let hasNextMessageFromSameUser: boolean;
				// eslint-disable-next-line prefer-const
				hasNextMessageFromSameUser = prevMessage?.authorId === message.authorId;
				return (
					<div key={`${message.id}`}>
						<div
							className={cn("flex items-end", {
								"justify-end": isCurrentUser
							})}
						>
							<div
								className={cn("mx-2 flex max-w-xs flex-col space-y-2", {
									"order-1 items-end": isCurrentUser,
									"order-2 items-start": !isCurrentUser
								})}
							>
								<div>
									<ContextMenu>
										<ContextMenuTrigger>
											<ChatBubble
												currentUser={isCurrentUser}
												member={isMember}
												hasNextMessageFromSameUser={hasNextMessageFromSameUser}
												message={{ ...message, status: "message" }}
											/>
										</ContextMenuTrigger>
										<ContextMenuContent updatePositionStrategy="optimized" alignOffset={5}>
											<ContextMenuItem>{message.id}</ContextMenuItem>
											<ContextMenuItem>React</ContextMenuItem>
											<ContextMenuItem>Delete</ContextMenuItem>
										</ContextMenuContent>
									</ContextMenu>
									<div
										className={cn("mt-1 flex w-full items-center space-x-2 text-xs text-gray-400", {
											"text-gray-400/50": !isMember,
											"justify-end": isCurrentUser,
											"justify-start": !isCurrentUser
										})}
									>
										<span
											className={cn("", {
												"order-2 pl-1": isCurrentUser
											})}
										>
											{formatTimestamp(message.createdAt)}
										</span>
										<div className="flex items-center">
											<ReplyDialog message={message} isMember={isMember} />
											<EmojiDialog
												status="message"
												isCurrentUser={isCurrentUser}
												message={message}
											/>
										</div>
									</div>
								</div>
							</div>
							<div
								className={cn("relative h-6 w-6", {
									"order-2": isCurrentUser,
									"order-1": !isCurrentUser,
									invisible: hasNextMessageFromSameUser
								})}
							>
								<Image
									fill
									src={
										isCurrentUser
											? session.user.imageUrl
											: message.author.imageUrl
												? message.author.imageUrl
												: "/images/avatar-placeholder.png"
									}
									alt="Profile picture"
									referrerPolicy="no-referrer"
									className="rounded-full"
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
});

Messages.displayName = "Messages";

export default Messages;
