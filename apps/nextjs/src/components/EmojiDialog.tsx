import { FC, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import EmojiPicker from "emoji-picker-react";
import { SmilePlus } from "lucide-react";

import { cn } from "@genus/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@genus/ui/popover";

import { trpc } from "~/utils/trpc";
import { Message, ThreadComment } from "~/utils/types";
import Reactions from "./Reactions";

interface MessagesProps {
	status: "message";
	isCurrentUser: boolean;
	message: Message;
}

interface ThreadCommentsProps {
	status: "comment";
	isCurrentUser: boolean;
	message: ThreadComment;
}

type Props = MessagesProps | ThreadCommentsProps;

const EmojiDialog: FC<Props> = props => {
	const { userId } = useAuth();
	const utils = trpc.useUtils();

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
						"justify-end": reaction && props.status === "comment",
						"order-first pr-1": props.isCurrentUser && props.status === "message",
						"order-last": !props.isCurrentUser
					})}
					role="button"
				>
					{!reaction && <SmilePlus size={15} />}
					{props.status === "message" ? (
						<Reactions
							message={{ ...props.message, status: "message" }}
							isCurrentUser={props.isCurrentUser}
						/>
					) : (
						<Reactions
							message={{ ...props.message, status: "comment" }}
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
							...(props.status === "message" && { messageId: props.message.id }),
							...(props.status === "comment" && { commentId: props.message.id })
						});
					}}
				/>
			</PopoverContent>
		</Popover>
	);
};

export default EmojiDialog;
