import React, { useMemo } from "react";
import type { FC } from "react";
import { useAuth } from "@clerk/nextjs";
import EmojiPicker from "emoji-picker-react";
import { SmilePlus } from "lucide-react";

import { cn } from "@genus/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@genus/ui/popover";

import Reactions from "~/components/Reactions";
import { trpc } from "~/utils/trpc";
import type { Message, ThreadComment } from "~/utils/types";

interface MessagesProps {
	type: "message";
	isCurrentUser: boolean;
	message: Message;
}

interface ThreadCommentsProps {
	type: "comment";
	isCurrentUser: boolean;
	message: ThreadComment;
}

type Props = MessagesProps | ThreadCommentsProps;

const EmojiDialog: FC<Props> = props => {
	const { userId } = useAuth();
	const utils = trpc.useUtils();
	/*const {data: reaction} = trpc.reaction.getReaction.useQuery({
        type: props.type,
        id: props.message.id,
    }, {
        enabled: !!props.message.id,
        onSuccess(data) {
            if (data?.messageId === 17) console.log(data)
        }
    })*/
	const { mutate: upsertReaction } = trpc.reaction.upsertReaction.useMutation({
		onSuccess(data) {
			console.log(data);
			void utils.group.invalidate();
			void utils.thread.invalidate();
		}
	});

	const reaction = useMemo(() => {
		return props.message.reactions.find(reaction => reaction.authorId === userId);
	}, [props.message, userId]);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div
					className={cn("flex grow items-center pl-1", {
						"justify-end": reaction && props.type === "comment",
						"order-first pr-1": props.isCurrentUser && props.type === "message",
						"order-last": !props.isCurrentUser
					})}
					role="button"
				>
					{!reaction && <SmilePlus size={15} />}
					{props.type === "message" ? (
						<Reactions
							message={{ ...props.message, type: "message" }}
							isCurrentUser={props.isCurrentUser}
						/>
					) : (
						<Reactions
							message={{ ...props.message, type: "comment" }}
							isCurrentUser={props.isCurrentUser}
						/>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent className="bg-none">
				<EmojiPicker
					onEmojiClick={emoji => {
						upsertReaction({
							id: reaction?.id ?? -1,
							emoji: emoji.emoji,
							code: emoji.unified,
							...(props.type === "message" && { messageId: props.message.id }),
							...(props.type === "comment" && { commentId: props.message.id })
						});
					}}
				/>
			</PopoverContent>
		</Popover>
	);
};

export default EmojiDialog;
