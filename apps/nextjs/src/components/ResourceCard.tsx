import type { FC } from "react";
import React from "react";

import { Progress } from "@genus/ui/progress";

import { convertToPercentage } from "~/utils";

interface Props {
	text: string;
	count: number;
	total: number;
}

const ResourceCard: FC<Props> = ({ text, count, total }) => {
	return (
		<div className="flex grid auto-cols-auto grid-flow-col grid-cols-6 items-center px-0 py-3">
			<span className="col-span-3 text-base font-medium capitalize tracking-tight text-black sm:text-xl sm:font-semibold lg:col-span-2">
				{text}
			</span>
			<Progress
				rounded={false}
				id={text}
				value={convertToPercentage(count, total)}
				className="col-span-2 bg-white"
			/>
			<span className="col-span-1 italic lg:col-span-2">{convertToPercentage(count, total)}%</span>
		</div>
	);
};

export default ResourceCard;
