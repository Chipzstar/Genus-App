import type {FC} from 'react'
import React, {Fragment, useMemo} from 'react'
import type {Message, ThreadComment} from '~/utils/types'
import {convertToNestedArray} from '~/utils'
import {compareDesc} from 'date-fns'
import {trpc} from '~/utils/trpc'
import {useAuth} from '@clerk/nextjs'
import {cn} from '@genus/ui'

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
            void utils.group.invalidate()
            void utils.thread.invalidate()
        }
    })

    const reactions = useMemo(() => {
        const sorted = props.message.reactions;
        sorted.sort(
            (a, b) => compareDesc(a.createdAt, b.createdAt)
        )
        return convertToNestedArray(sorted);
    }, [props.message.reactions]);


    return (
        <div className={cn("flex float-right relative bottom-2 grow", {
            'order-first right-1': props.isCurrentUser && props.message.type === "message",
            'order-last left-1': !props.isCurrentUser && props.message.type === "message",
            'justify-end': props.message.type === "comment",
        })}>
            {reactions.slice(0, 3).map((emojis, index) => (
                <Fragment key={index}>
                    {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
                    <div
                        role="button"
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
                </Fragment>
            ))}
        </div>
    );
};

export default Reactions;
