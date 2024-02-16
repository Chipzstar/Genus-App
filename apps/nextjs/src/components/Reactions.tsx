import type { FC } from "react";
import React, { Fragment, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { compareDesc } from "date-fns";

import { cn } from "@genus/ui";

import { convertToNestedArray } from "~/utils";
import { trpc } from "~/utils/trpc";
import type { Message, ThreadComment } from "~/utils/types";

interface Props {
	message: ({ type: "message" } & Message) | ({ type: "comment" } & ThreadComment);
	isCurrentUser: boolean;
}

const Reactions: FC<Props> = (props: Props) => {
	const { userId } = useAuth();
	const utils = trpc.useUtils();
	const { mutate: deleteReaction } = trpc.reaction.deleteReaction.useMutation({
		onSuccess(data) {
			console.log(data);
			void utils.group.invalidate();
			void utils.thread.invalidate();
		}
	});

	const reactions = useMemo(() => {
		const sorted = props.message.reactions;
		sorted.sort((a, b) => compareDesc(a.createdAt, b.createdAt));
		return convertToNestedArray(sorted);
	}, [props.message.reactions]);

	return (
		<div
			className={cn("relative bottom-2 float-right flex grow", {
				"right-1 order-first": props.isCurrentUser && props.message.type === "message",
				"left-1 order-last": !props.isCurrentUser && props.message.type === "message",
				"justify-end": props.message.type === "comment"
			})}
		>
			{reactions.slice(0, 3).map((emojis, index) => (
				<Fragment key={index}>
					<div
						role="button"
						className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-900 sm:h-5 sm:w-5 sm:text-sm"
						onContextMenu={e => {
							e.preventDefault();
							deleteReaction({
								id: emojis.find(e => e.authorId === userId)?.id ?? -1
							});
						}}
					>
						{emojis[0]?.emoji}
					</div>
					<span className="relative right-1 top-2.5 text-xxs font-medium">{emojis.length}</span>
				</Fragment>
			))}
		</div>
	);
};

export default Reactions;
