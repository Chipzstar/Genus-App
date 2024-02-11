import type { FC } from "react";
import React from "react";

import type { IconProps } from "./types";

export const SearchIcon: FC<IconProps> = ({ size = 19, active = false }) => {
	return (
		<svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M9.075 17.15C13.5347 17.15 17.15 13.5347 17.15 9.075C17.15 4.6153 13.5347 1 9.075 1C4.6153 1 1 4.6153 1 9.075C1 13.5347 4.6153 17.15 9.075 17.15Z"
				stroke={active ? "#2AA6B7" : "#757882"}
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M18 18L16.3 16.3"
				stroke={active ? "#2AA6B7" : "#757882"}
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
};
