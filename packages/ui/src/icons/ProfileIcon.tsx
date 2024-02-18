import React, { FC } from "react";

import type { IconProps } from "./types";

export const ProfileIcon: FC<IconProps> = ({ size = 24, active, color }) => {
	return (
		<svg width={size} height={size * 1.1} viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M10.4492 12C13.4868 12 15.9492 9.53756 15.9492 6.5C15.9492 3.46244 13.4868 1 10.4492 1C7.41166 1 4.94922 3.46244 4.94922 6.5C4.94922 9.53756 7.41166 12 10.4492 12Z"
				stroke={active ? "#2AA6B7" : "#757882"}
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M19.898 23C19.898 18.743 15.663 15.3 10.449 15.3C5.235 15.3 1 18.743 1 23"
				stroke={active ? "#2AA6B7" : "#757882"}
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
