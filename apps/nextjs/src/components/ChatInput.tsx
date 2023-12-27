'use client'

import {FC, useCallback, useRef, useState} from 'react'
import {Textarea} from "@genus/ui/textarea";
import {Button} from '@genus/ui/button'
import {trpc} from "~/utils/trpc";
import {toast} from "@genus/ui/use-toast";

interface ChatInputProps {
    chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({chatId}) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const utils = trpc.useUtils();
    const { mutateAsync: createMessage } = trpc.message.createMessage.useMutation({
        onSuccess(data) {
            console.log(data)
            utils.invalidate()
        }
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')

    const sendMessage = useCallback(async () => {
        if (!input) return
        setIsLoading(true)
        try {
            const result = await createMessage({content: input, groupId: chatId})
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
    }, [input, chatId])

    return (
        <div className='border-t border-gray-200 pt-4 mb-2 sm:mb-0'>
            <div
                className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
                <Textarea
                    ref={textareaRef}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                        }
                    }}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
                />

                {/*<div
                    onClick={() => textareaRef.current?.focus()}
                    className='py-2'
                    aria-hidden='true'>
                    <div className='py-px'>
                        <div className='h-9'/>
                    </div>
                </div>*/}

                <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
                    <div className='flex-shrin-0'>
                        <Button loading={isLoading} onClick={sendMessage} type='submit'>
                            Post
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatInput
