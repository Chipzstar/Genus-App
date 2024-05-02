import type { FC } from "react";
import React from "react";
import { useRouter } from "next/router";

import { ScrollArea } from "@genus/ui/scroll-area";

import NotificationCard from "~/components/NotificationCard";
import type { IRemoteNotification } from "~/components/NotificationCard";
import { PATHS } from "~/utils";

interface Props {
	items: IRemoteNotification[];
}

const NotificationList: FC<Props> = ({ items }: Props) => {
	const router = useRouter();

	const handleClick = (item: IRemoteNotification) => {
		void router.push(`${PATHS.GROUPS}${item.actionUrl}`);
	};

	return (
		<ScrollArea className="notification-container">
			{items.length ? (
				<div className="flex flex-col gap-2 pb-4 pt-0 md:p-4">
					{items.map(item => (
						<NotificationCard key={item.id} item={item} onClick={handleClick} />
					))}
				</div>
			) : (
				<span className="px-4">No messages.</span>
			)}
		</ScrollArea>
	);
};

export default NotificationList;
