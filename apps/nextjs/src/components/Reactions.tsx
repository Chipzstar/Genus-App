import {Reaction} from '@genus/db';
import React, {FC, useEffect, useMemo} from 'react';
import {Message, ThreadComment} from "~/utils/types";
import {convertToNestedArray} from "~/utils";
import {compareDesc} from 'date-fns';
import {trpc} from "~/utils/trpc";
import {useAuth, useSession} from '@clerk/nextjs';
import {cn} from "@genus/ui";

interface Props {
    message: { type: "message" } & Message | { type: "comment" } & ThreadComment;
    isCurrentUser: boolean;
}

const Reactions: FC<Props> = (props: Props) => {
    const {userId} = useAuth();
    const utils = trpc.useUtils();
    const {mutate: deleteReaction} = trpc.reaction.deleteReaction.useMutation({
        onSuccess(data) {
            console.log(data)
            utils.group.invalidate()
            utils.thread.invalidate()
        }
    })

    const reactions = useMemo(() => {
        let sorted = props.message.reactions as Reaction[];
        sorted.sort(
            (a, b) => compareDesc(a.createdAt, b.createdAt)
        )
        return convertToNestedArray(sorted);
    }, [props.message.reactions]);


    return (
        <div className={cn("flex float-right relative bottom-2", {
            'order-first right-1': props.isCurrentUser,
            'order-last left-1': !props.isCurrentUser
        })}>
            {reactions.slice(0, 3).map((emojis, index) => (
                <>
                    <div
                        role="button"
                        key={index}
                        className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200 text-gray-900 text-xs sm:text-sm"
                        onContextMenu={(e) => {
                            e.preventDefault();
                            deleteReaction({
                                id: emojis.find((e) => e.authorId === userId)?.id ?? -1
                            })
                        }}
                    >
                        {emojis[0]?.emoji}
                    </div>
                    <span className="relative font-medium text-xxs top-2.5 right-1">{emojis.length}</span>
                </>
            ))}
        </div>
    );
};

export default Reactions;
