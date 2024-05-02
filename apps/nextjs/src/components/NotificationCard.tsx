import type { FC } from "react";
import React from "react";
import { formatDistanceToNow, fromUnixTime } from "date-fns";

import { cn } from "@genus/ui";

import { formatString } from "~/utils";

export interface IRemoteNotification {
	id: string;
	actionUrl: string;
	title: string;
	content: string;
	topic?: string | null;
	isRead: boolean;
	readAt: number | null;
	sentAt: number | null;
}

interface Props {
	item: IRemoteNotification;
	onClick: (item: IRemoteNotification) => void;
}

const NotificationCard: FC<Props> = ({ item, onClick }: Props) => {
	return (
		<button
			key={item.id}
			className={cn(
				"flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all" +
					" hover:bg-accent"
			)}
			onClick={() => {
				console.log("mark as read", item);
			}}
		>
			<div className="flex w-full flex-col gap-1">
				<div className="flex items-center">
					<div className="sm:text:base flex items-center gap-2 text-sm">
						<div className="font-semibold">{item.title}</div>
						{!item.readAt && <span className="flex h-2 w-2 rounded-full bg-blue-600" />}
					</div>
					<div className={cn("ml-auto text-xs text-foreground")}>
						{formatDistanceToNow(fromUnixTime(item.sentAt!), {
							addSuffix: true
						})}
					</div>
				</div>
				<div className="text-xs font-medium">{formatString(item.topic)}</div>
			</div>
			<div className="line-clamp-2 text-xs text-muted-foreground">{item.content?.substring(0, 300)}</div>
		</button>
	);
};

export default NotificationCard;
