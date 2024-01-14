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
    return (
        <Sheet key={message.id}>
            <SheetTrigger key={message.id}>
                <span>
                    <Reply strokeWidth={1.5} size={20}/>
                </span>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Thread <span
                        className="text-sm text-gray-500 font-normal">{message.author.firstname}</span>
                    </SheetTitle>
                    <Separator className="my-6"/>
                    <SheetDescription>
                        <div className="py-2">
                            <ChatBubble
                                currentUser={message.authorId === session.user.id}
                                member={isMember}
                                hasNextMessageFromSameUser={false}
                                message={message}
                            />
                            <div className={cn('mt-1 text-xs text-gray-400', {
                                'text-gray-400/50': !isMember,
                                'text-end': message.authorId === session.user.id,
                                'text-start': message.authorId !== session.user.id,
                            })}>
                                {formatTimestamp(message.createdAt)}
                            </div>
                            {thread?.comments && <Listbox
                                items={thread.comments}
                                aria-label="Dynamic Actions"
                                onAction={(key) => alert(key)}
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
                                            <div className={cn('mt-1 text-xs text-gray-400', {
                                                'text-gray-400/50': !isMember,
                                                'text-end': isCurrentUser,
                                                'text-start': !isCurrentUser,
                                            })}>
                                                {formatTimestamp(c.createdAt)}
                                            </div>
                                        </ListboxItem>
                                    );
                                }}
                            </Listbox>}
                        </div>
                        <ChatInput
                            type="reply"
                            chatId={message?.thread?.threadId}
                            isMember={isMember}
                            message={message}
                        />
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

export default ReplyDialog;
