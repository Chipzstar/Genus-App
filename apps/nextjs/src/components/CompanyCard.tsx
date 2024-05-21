import type { FC } from "react";
import React, { useMemo } from "react";
import { Image } from "@nextui-org/react";
import pluralize from "pluralize";

import { cn } from "@genus/ui";
import { Ratings } from "@genus/ui/rating";

import type { Company, CompanyReviews } from "~/utils/types";

interface Props {
	onClick?: () => void;
	company: Company;
	reviews: CompanyReviews;
	hideRating?: boolean;
}

const CompanyCard: FC<Props> = ({ onClick = undefined, company, reviews, hideRating = false }) => {
	const numReviews = useMemo(() => `${pluralize("review", reviews.length, true)}`, [reviews]);

	const rating = useMemo(() => {
		const total = reviews.reduce((prev, acc) => prev + Number(acc.avgRating) / 2, 0);
		return reviews.length ? total / reviews.length : 2.5;
	}, [reviews]);

	return (
		<div
			role="button"
			onClick={onClick}
			className="mb-5 grid grid-cols-3 place-items-center gap-x-8 gap-y-4 sm:mb-0"
		>
			<Image
				src={company.logoUrl ?? "/images/spring-weeks-ldn.svg"}
				alt={company.name}
				className="sm:p-5"
				style={{
					objectFit: "contain"
				}}
				radius="lg"
				width={150}
				height={100}
			/>

			<div
				className={cn("flex w-full flex-col space-y-2", {
					"col-span-2": hideRating
				})}
			>
				<span className="text-ellipsis text-base font-semibold text-black md:text-lg">{company.name}</span>
				<div className="flex">
					<Ratings size={20} rating={rating} />
				</div>
				<span className="text-sm text-black md:text-lg">{numReviews}</span>
			</div>
			<div
				className={cn("text-2xl font-semibold md:text-3xl", {
					hidden: hideRating
				})}
			>
				{rating.toFixed(1)}
			</div>
		</div>
	);
};

export default CompanyCard;
