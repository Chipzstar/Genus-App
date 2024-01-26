import {cn} from "@genus/ui";
import React, {Fragment, useState} from "react";
import type {Message, ThreadComment} from "~/utils/types";


export function ChatBubble(props: {
    currentUser: boolean,
    member: boolean,
    hasNextMessageFromSameUser: boolean,
    message: { type: "message" } & Message | { type: "comment" } & ThreadComment,
}) {
    return (
        <Fragment>
            <div
                className={cn("flex flex-col px-4 py-2 rounded-lg text-gray-900 text-xs sm:text-sm", {
                    "bg-chat-bubble-internal/50 text-gray-300": props.currentUser && !props.member,
                    "bg-chat-bubble-external/50 text-gray-300": !props.currentUser && !props.member,
                    "bg-chat-bubble-internal": props.currentUser && props.member,
                    "bg-chat-bubble-external": !props.currentUser && props.member,
                    "rounded-br-none":
                        !props.hasNextMessageFromSameUser && props.currentUser,
                    "rounded-bl-none":
                        !props.hasNextMessageFromSameUser && !props.currentUser,
                })}>
                <span className="font-medium mb-2">{props.message.author.firstname}</span>
                <span>{props.message.content}</span>
            </div>
        </Fragment>
    )
}
