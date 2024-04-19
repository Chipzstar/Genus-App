import React from "react";
import { useRouter } from "next/router";
import { useNotifications } from "@magicbell/magicbell-react";
import { cx } from "class-variance-authority";

import { BellIcon, CompanyIcon, GroupIcon, HomeIcon, ProfileIcon, SearchIcon } from "@genus/ui/icons";

import { PATHS } from "~/utils";

interface Props {
	activePage: string;
}

const BottomNav = ({ activePage = PATHS.HOME }: Props) => {
	const router = useRouter();
	const unreadStore = useNotifications("unread");
	return (
		<div className="border-gray-2000 fixed bottom-0 left-0 z-50 h-16 w-full border-t bg-white">
			<div className="mx-auto grid h-full max-w-2xl grid-cols-5 font-medium text-gray-500">
				<button
					type="button"
					className="group inline-flex flex-col items-center justify-center px-5 dark:hover:bg-gray-800"
					onClick={() => router.push(PATHS.HOME)}
				>
					<HomeIcon active={activePage === PATHS.HOME} size={25} />
					<span
						className={cx(
							activePage === PATHS.HOME && "text-primary group-hover:text-primary",
							"text-xs sm:text-sm"
						)}
					>
						Home
					</span>
				</button>
				<button
					type="button"
					className="group inline-flex flex-col items-center justify-center px-5 dark:hover:bg-gray-800"
					onClick={() => router.push(PATHS.COMPANIES)}
				>
					<CompanyIcon active={activePage.includes(PATHS.COMPANIES)} size={25} />
					<span
						className={cx(
							activePage.includes(PATHS.COMPANIES) && "text-primary group-hover:text-primary",
							"text-xs sm:text-sm"
						)}
					>
						Companies
					</span>
				</button>
				<button
					type="button"
					className="group mr-2 inline-flex flex-col items-center justify-center px-5 dark:hover:bg-gray-800"
					onClick={() => router.push(PATHS.INSIGHTS)}
				>
					<SearchIcon active={activePage.includes(PATHS.INSIGHTS)} size={25} />
					<span
						className={cx(
							activePage.includes(PATHS.INSIGHTS) && "text-primary group-hover:text-primary",
							"text-xs sm:text-sm"
						)}
					>
						Insights
					</span>
				</button>
				<button
					type="button"
					className="group inline-flex flex-col items-center justify-center px-5 dark:hover:bg-gray-800"
					onClick={() => router.push(PATHS.NOTIFICATIONS)}
				>
					{unreadStore?.notifications.length ? (
						<span className="absolute top-1 ml-2 flex h-3 w-3">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
							<span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
						</span>
					) : null}
					<BellIcon active={activePage === PATHS.NOTIFICATIONS} size={25} />
					<span
						className={cx(
							activePage === PATHS.NOTIFICATIONS && "text-primary group-hover:text-primary",
							"text-xs sm:text-sm"
						)}
					>
						Notifications
					</span>
				</button>
				<button
					type="button"
					className="group ml-1 inline-flex flex-col items-center justify-center px-5 dark:hover:bg-gray-800"
					onClick={() => router.push(PATHS.PROFILE)}
				>
					<ProfileIcon active={activePage === PATHS.PROFILE} size={24} />
					<span
						className={cx(
							activePage === PATHS.PROFILE && "text-primary group-hover:text-primary",
							"text-xs sm:text-sm"
						)}
					>
						Profile
					</span>
				</button>
			</div>
		</div>
	);
};

export default BottomNav;
