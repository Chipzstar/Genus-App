import React from "react";
import { useRouter } from "next/router";
import { cx } from "class-variance-authority";
import { User2 } from "lucide-react";

import { BellIcon, GroupIcon, HomeIcon, SearchIcon } from "@genus/ui/icons";

import { PATHS } from "~/utils";

interface Props {
	activePage: string;
}

const BottomNav = ({ activePage = PATHS.HOME }: Props) => {
	const router = useRouter();
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
					onClick={() => router.push(PATHS.GROUPS)}
				>
					<GroupIcon active={activePage.includes(PATHS.GROUPS)} size={25} />
					<span
						className={cx(
							activePage.includes(PATHS.GROUPS) && "text-primary group-hover:text-primary",
							"text-xs sm:text-sm"
						)}
					>
						Groups
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
					<User2 color={activePage === PATHS.PROFILE ? "#2AA6B7" : "#757882"} size={25} strokeWidth={1.5} />
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
