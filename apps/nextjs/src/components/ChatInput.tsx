'use client'

import {FC, useCallback, useRef, useState} from 'react'
import {Textarea} from "@genus/ui/textarea";
import {Button} from '@genus/ui/button'
import {trpc} from "~/utils/trpc";
import {toast} from "@genus/ui/use-toast";
import {Message} from "~/utils/types";

interface ChatMessageProps {
    type: 'message',
    chatId: string;
    isMember: boolean;
}
interface NewThreadProps {
    replyType: "thread";
    chatId?: undefined;
    isMember: boolean;
    message: Message;
}

interface NewCommentProps {
    replyType: "comment";
    chatId: string;
    isMember: boolean;
    message: Message;
}

type ChatReplyProps = { type: "reply" } & (NewThreadProps | NewCommentProps);

const ChatInput: FC<ChatMessageProps | ChatReplyProps> = (props) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const utils = trpc.useUtils();
    const { mutateAsync: createMessage } = trpc.message.createMessage.useMutation({
        onSuccess(data) {
            console.log(data)
            utils.group.invalidate()
        }
    })
    const { mutateAsync: createComment } = trpc.comment.createComment.useMutation({
        onSuccess(data) {
            console.log(data)
            utils.group.invalidate()
            utils.thread.invalidate()
        }
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')

    const sendMessage = useCallback(async () => {
        if (!input) return
        setIsLoading(true)
        try {
            if (props.type === "reply") {
                if (props.replyType === "thread") {
                    await createComment({
                        type: "thread",
                        content: input,
                        messageContent: props.message.content,
                        messageId: props.message.id,
                        authorId: props.message.authorId
                    })
                } else {
                    await createComment({
                        type: "comment",
                        content: input,
                        threadId: props.chatId,
                        messageId: props.message.id,
                        authorId: props.message.authorId
                    })
                }
            } else {
                await createMessage({content: input, groupId: props.chatId})
            }
            setInput('')
            textareaRef.current?.focus()
        } catch (err: any) {
            toast({
                title: 'Oops!',
                description: err.message,
                duration: 5000
            })
        } finally {
            setIsLoading(false)
        }
    }, [input, props, createMessage])

    return (
        <div className='border-t border-gray-200 pt-4 mb-2 sm:mb-0'>
            <div
                className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
                <Textarea
                    disabled={!props.isMember}
                    ref={textareaRef}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage().then(r => console.log("Message sent!"))
                        }
                    }}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
                />

                <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
                    <div className='flex-shrin-0'>
                        <Button loading={isLoading} disabled={isLoading || !input} onClick={sendMessage} type='submit' size="sm">
                            {props.type === "message" ? "Post" : "Reply"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatInput
