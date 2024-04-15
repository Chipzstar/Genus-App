import type { FC } from "react";
import React from "react";

import { Ratings } from "@genus/ui/rating";

import type { CompanyPanel } from "~/utils/types";

interface Props {
	onClick: () => void;
	company: CompanyPanel;
	numReviews: number;
}

const CompanyCard: FC<Props> = ({ onClick, company, numReviews }) => {
	return (
		<div role="button" onClick={onClick} className="grid grid-cols-3 place-items-center gap-x-8 gap-y-4">
			<img
				src={company.image}
				alt={company.title}
				style={{
					objectFit: "contain"
				}}
				width={150}
				height={100}
			/>
			<div className="flex w-full flex-col space-y-2">
				<span className="text-ellipsis text-base font-semibold text-black md:text-lg">{company.title}</span>
				<div className="flex">
					<Ratings size={20} rating={4} />
				</div>
				<span className="text-sm text-black md:text-lg">{numReviews} reviews</span>
			</div>
			<div className="text-2xl font-semibold md:text-3xl"></div>
		</div>
	);
};

export default CompanyCard;
