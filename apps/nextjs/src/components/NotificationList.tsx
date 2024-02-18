import type { FC } from "react";
import React from "react";
import { useRouter } from "next/router";
import type { IRemoteNotification } from "@magicbell/magicbell-react";

import { ScrollArea } from "@genus/ui/scroll-area";

import NotificationCard from "~/components/NotificationCard";
import { PATHS } from "~/utils";

interface Props {
	items: IRemoteNotification[];
}

const NotificationList: FC<Props> = ({ items }: Props) => {
	const router = useRouter();

	const handleClick = (item: IRemoteNotification) => {
		console.log(item);
		void router.push(`${PATHS.GROUPS}${item.actionUrl}`);
	};

	return (
		<ScrollArea className="h-screen">
			{items.length ? (
				<div className="flex flex-col gap-2 p-4 pt-0">
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
