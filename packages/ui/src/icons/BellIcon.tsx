import type { FC } from "react";
import React from "react";

import type { IconProps } from "./types";

export const BellIcon: FC<IconProps> = ({ size = 25, active, color }) => {
	return (
		<svg width={size * 0.8} height={size} viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M7.99677 17.5969C5.87781 17.5969 3.75888 17.2605 1.74908 16.5875C0.985173 16.3238 0.403149 15.7872 0.148513 15.087C-0.115217 14.3867 -0.0242753 13.6137 0.394054 12.9226L1.43988 11.1856C1.65814 10.8218 1.85821 10.0943 1.85821 9.66687V7.03868C1.85821 3.65567 4.61373 0.900146 7.99677 0.900146C11.3798 0.900146 14.1353 3.65567 14.1353 7.03868V9.66687C14.1353 10.0852 14.3354 10.8218 14.5536 11.1947L15.5904 12.9226C15.9814 13.5773 16.0542 14.3685 15.7904 15.087C15.5267 15.8054 14.9538 16.351 14.2353 16.5875C12.2346 17.2605 10.1157 17.5969 7.99677 17.5969ZM7.99677 2.26427C5.36854 2.26427 3.22233 4.40138 3.22233 7.03868V9.66687C3.22233 10.3307 2.9495 11.3129 2.61302 11.8858L1.5672 13.6228C1.36713 13.9593 1.31256 14.314 1.43078 14.6141C1.53991 14.9233 1.81274 15.1597 2.1856 15.287C5.98694 16.5602 10.0157 16.5602 13.817 15.287C14.1444 15.1779 14.399 14.9324 14.5173 14.605C14.6355 14.2776 14.6082 13.9229 14.4263 13.6228L13.3805 11.8858C13.0349 11.2947 12.7712 10.3216 12.7712 9.65777V7.03868C12.7712 4.40138 10.6341 2.26427 7.99677 2.26427Z"
				fill={active ? "#2AA6B7" : "#757882"}
			/>
			<path
				d="M9.68796 2.50998C9.6243 2.50998 9.56064 2.50088 9.49698 2.4827C9.23325 2.40994 8.97862 2.35538 8.73308 2.319C7.96008 2.21897 7.21436 2.27353 6.51411 2.4827C6.25948 2.56454 5.98668 2.4827 5.81389 2.29172C5.6411 2.10074 5.58654 1.82792 5.68657 1.58238C6.05943 0.627495 6.96882 0 8.00555 0C9.04228 0 9.95169 0.618401 10.3246 1.58238C10.4155 1.82792 10.37 2.10074 10.1972 2.29172C10.0608 2.43723 9.86984 2.50998 9.68796 2.50998Z"
				fill={active ? "#2AA6B7" : "#757882"}
			/>
			<path
				d="M7.99645 19.6706C7.09613 19.6706 6.2231 19.3068 5.58653 18.6702C4.94995 18.0336 4.58618 17.1606 4.58618 16.2603H5.9503C5.9503 16.7968 6.16853 17.3243 6.55048 17.7062C6.93244 18.0882 7.4599 18.3064 7.99645 18.3064C9.12412 18.3064 10.0426 17.3879 10.0426 16.2603H11.4067C11.4067 18.1427 9.87893 19.6706 7.99645 19.6706Z"
				fill={active ? "#2AA6B7" : "#757882"}
			/>
		</svg>
	);
};
