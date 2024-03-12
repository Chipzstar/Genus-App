"use client";

import { FC, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";

import { Button } from "@genus/ui/button";
import { Checkbox } from "@genus/ui/checkbox";
import { Textarea } from "@genus/ui/textarea";

import { trpc } from "~/utils/trpc";
import type { Message } from "~/utils/types";

interface ChatMessageProps {
	type: "message";
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

type Props = ChatMessageProps | ChatReplyProps;

const ChatInput = forwardRef<HTMLDivElement, Props>((props, ref) => {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const chatWrapperRef = useRef<HTMLInputElement>(null);

	// @ts-expect-error ref.current will be defined
	useImperativeHandle(ref, () => ref?.current as HTMLInputElement);

	const utils = trpc.useUtils();
	const { mutateAsync: createMessage } = trpc.message.createMessage.useMutation({
		onSuccess(data) {
			console.log(data);
			void utils.group.invalidate();
			if (chatWrapperRef?.current) chatWrapperRef.current.scrollTop = chatWrapperRef.current.scrollHeight;
		}
	});
	const { mutateAsync: createComment } = trpc.comment.createComment.useMutation({
		onSuccess(data) {
			console.log(data);
			void utils.group.invalidate();
			void utils.thread.invalidate();
		}
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [input, setInput] = useState<string>("");
	const [isAnonymous, setState] = useState<boolean>(false);

	const sendMessage = useCallback(async () => {
		if (!input) return;
		setIsLoading(true);
		try {
			if (props.type === "reply") {
				if (props.replyType === "thread") {
					await createComment({
						type: "thread",
						content: input,
						messageContent: props.message.content,
						messageId: props.message.id,
						authorId: props.message.authorId,
						groupId: props.message.groupId,
						isAnonymous
					});
				} else {
					await createComment({
						type: "comment",
						content: input,
						threadId: props.chatId,
						messageId: props.message.id,
						authorId: props.message.authorId,
						groupId: props.message.groupId,
						isAnonymous
					});
				}
			} else {
				await createMessage({ content: input, groupId: props.chatId, isAnonymous });
			}
			setInput("");
			textareaRef.current?.focus();
		} catch (err) {
			const { message } = err as never;
			toast.error("Oops!", {
				description: message,
				duration: 5000
			});
		} finally {
			setIsLoading(false);
		}
	}, [input, props, createMessage, isAnonymous]);

	return (
		<div className="mb-2 border-t border-gray-200 pt-4 sm:mb-0">
			<div className="mb-2 flex items-center justify-end space-x-2">
				<Checkbox
					className="bg-background"
					id="anonymous"
					defaultChecked={isAnonymous}
					onCheckedChange={val => {
						setState(state => !state);
					}}
				/>
				<label
					htmlFor="anonymous"
					className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Post anonymously
				</label>
			</div>
			<div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
				<Textarea
					disabled={!props.isMember}
					ref={textareaRef}
					onKeyDown={e => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							void sendMessage().then(r => console.log("Message sent!"));
						}
					}}
					rows={1}
					value={input}
					onChange={e => setInput(e.target.value)}
					className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
				/>

				<div className="absolute bottom-0 right-0 flex justify-between py-2 pl-3 pr-2">
					<div className="flex-shrin-0">
						<Button
							loading={isLoading}
							disabled={isLoading || !input}
							onClick={sendMessage}
							type="submit"
							size="sm"
						>
							{props.type === "message" ? "Post" : "Reply"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
});

ChatInput.displayName = "ChatInput";

export default ChatInput;
