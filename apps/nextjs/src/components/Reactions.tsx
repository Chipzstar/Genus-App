import {Reaction} from '@genus/db';
import React, {FC, useEffect, useMemo} from 'react';
import {Message, ThreadComment} from "~/utils/types";
import {convertToNestedArray} from "~/utils";
import {compareDesc} from 'date-fns';
import {trpc} from "~/utils/trpc";
import {useAuth, useSession } from '@clerk/nextjs';

interface Props {
    message: { type: "message" } & Message | { type: "comment" } & ThreadComment
}
const Reactions : FC<Props> = (props: Props) => {
    const { userId } = useAuth();
    const utils = trpc.useUtils();
    const  { mutate: deleteReaction } = trpc.reaction.deleteReaction.useMutation({
        onSuccess(data) {
            console.log(data)
            utils.group.invalidate()
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
        <div className="flex float-right relative bottom-2 left-1">
            {reactions.slice(0, 3).map((emojis, index) => (
                <>
                    <div
                        role="button"
                        key={index}
                        className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200 text-gray-900 text-xs sm:text-sm"
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
