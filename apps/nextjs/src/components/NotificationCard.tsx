import type { FC } from "react";
import React from "react";
import { useNotification, type IRemoteNotification } from "@magicbell/magicbell-react";
import { formatDistanceToNow, fromUnixTime } from "date-fns";
import { toast } from "sonner";

import { cn } from "@genus/ui";

import { formatString } from "~/utils";

interface Props {
	item: IRemoteNotification;
	onClick: (item: IRemoteNotification) => void;
}

const NotificationCard: FC<Props> = ({ item, onClick }: Props) => {
	const notification = useNotification(item);
	return (
		<button
			key={item.id}
			className={cn(
				"flex flex-col items-start gap-2 rounded-lg border px-0 py-3 text-left text-sm transition-all sm:px-3" +
					" hover:bg-accent"
			)}
			onClick={() => {
				void notification
					.markAsRead()
					.then(() => onClick(item))
					.catch(err => {
						console.error(err);
						toast.error("Failed to mark as read", {
							description: err.message
						});
					});
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
				<div className="text-xs font-medium">{formatString(item.topic!)}</div>
			</div>
			<div className="line-clamp-2 text-xs text-muted-foreground">{item.content?.substring(0, 300)}</div>
			{/*{item.customAttributes?.length ? (
							<div className="flex items-center gap-2">
								{item.customAttributes.map(label => (
									<Badge key={label} variant={getBadgeVariantFromLabel(label)}>
										{label}
									</Badge>
								))}
							</div>
						) : null}*/}
		</button>
	);
};

export default NotificationCard;
