import React from "react";
import { useRouter } from "next/router";
import { cx } from "class-variance-authority";

import { ChurchIcon, HomeIcon, ProfileIcon } from "@genus/ui/icons";

import { PATHS } from "~/utils";

interface Props {
	activePage: string;
}

const BottomNav = ({ activePage = PATHS.HOME }: Props) => {
	const router = useRouter();
	return (
		<div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-gray-200 bg-white">
			<div className="mx-auto grid h-full max-w-3xl grid-cols-3 font-medium text-gray-500">
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
					onClick={() => router.push(PATHS.CHURCH)}
				>
					<ChurchIcon active={activePage.includes(PATHS.CHURCH)} size={25} />
					<span
						className={cx(
							activePage.includes(PATHS.CHURCH) && "text-primary group-hover:text-primary",
							"text-xs sm:text-sm"
						)}
					>
						Church
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
