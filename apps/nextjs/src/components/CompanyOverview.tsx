import type { FC } from "react";
import React, { useMemo } from "react";
import { Chip, CircularProgress } from "@nextui-org/react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@genus/ui/card";
import { Progress } from "@genus/ui/progress";

import { convertToPercentage } from "~/utils";
import type { CompanyReviews } from "~/utils/types";

interface Props {
	reviews: CompanyReviews;
}

const CompanyOverview: FC<Props> = ({ reviews }) => {
	const { avgRating, ratingLevels } = useMemo(() => {
		const average = reviews.reduce((acc, { rating }) => acc + Number(rating), 0) / reviews.length;
		const rating1 = convertToPercentage(
			reviews.filter(({ rating }) => Math.round(Number(rating)) === 1).length,
			reviews.length
		);
		const rating2 = convertToPercentage(
			reviews.filter(({ rating }) => Math.round(Number(rating)) === 2).length,
			reviews.length
		);
		const rating3 = convertToPercentage(
			reviews.filter(({ rating }) => Math.round(Number(rating)) === 3).length,
			reviews.length
		);
		const rating4 = convertToPercentage(
			reviews.filter(({ rating }) => Math.round(Number(rating)) === 4).length,
			reviews.length
		);
		const rating5 = convertToPercentage(
			reviews.filter(({ rating }) => Math.round(Number(rating)) === 5).length,
			reviews.length
		);
		return {
			avgRating: Number(average.toFixed(1)),
			ratingLevels: [rating1, rating2, rating3, rating4, rating5]
		};
	}, [reviews]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Overview</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<CircularProgress
						classNames={{
							svg: "w-36 h-36 drop-shadow-md",
							indicator: "stroke-primary bg-gradient-to-r from-primary to-secondary-300",
							track: "stroke-white/10",
							value: "text-3xl font-semibold text-black"
						}}
						value={avgRating}
						formatOptions={{ style: "decimal" }}
						maxValue={5}
						strokeWidth={4}
						showValueLabel={true}
					/>
					<div className="flex grow flex-col">
						<span className="font-medium">Total Reviews: {reviews.length}</span>
						<article className="space-y-3">
							{ratingLevels.map((ratingLevel, index) => (
								<div key={`rating-${index + 1}`} className="flex space-x-3">
									<Progress
										id={`rating-${index + 1}`}
										value={ratingLevel}
										max={reviews.length}
										className="bg-white"
									/>
									<span>{ratingLevel}%</span>
								</div>
							))}
						</article>
					</div>
				</div>
				<div className="grid grid-cols-2"></div>
			</CardContent>
			<CardFooter>
				<p>Card Footer</p>
			</CardFooter>
		</Card>
	);
};

export default CompanyOverview;
