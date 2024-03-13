import React, { Fragment } from "react";

import { cn } from "@genus/ui";

import type { Message, ThreadComment } from "~/utils/types";

export function ChatBubble(props: {
	currentUser: boolean;
	member: boolean;
	hasNextMessageFromSameUser: boolean;
	message: ({ status: "message" } & Message) | ({ status: "comment" } & ThreadComment);
}) {
	const { message, currentUser, member, hasNextMessageFromSameUser } = props;
	return (
		<Fragment>
			<div
				className={cn("flex flex-col rounded-lg px-4 py-2 text-xs text-gray-900 sm:text-sm", {
					"bg-chat-bubble-internal-300/50 text-gray-400": currentUser && !member,
					"bg-chat-bubble-external-300/50 text-gray-400": !currentUser && !member,
					"bg-chat-bubble-internal-300": currentUser && member,
					"bg-chat-bubble-external-200": !currentUser && member,
					"rounded-br-none": !hasNextMessageFromSameUser && currentUser,
					"rounded-bl-none": !hasNextMessageFromSameUser && !currentUser
				})}
			>
				<span className={cn("mb-2 font-medium", { 'invisible': !member})}>{message.isAnonymous ? `Anon` : message.author.firstname}</span>
				<span className={cn({'invisible': !member})}>{message.content}</span>
			</div>
		</Fragment>
	);
}
