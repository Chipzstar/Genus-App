import type { FC } from "react";
import React, { useMemo } from "react";
import { CircularProgress } from "@nextui-org/react";

import { cn } from "@genus/ui";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@genus/ui/card";
import { Progress } from "@genus/ui/progress";

import { convertRatingToLevel, convertToPercentage } from "~/utils";
import type { CompanyReviews, RatingLevel } from "~/utils/types";

interface Props {
	reviews: CompanyReviews;
}

const CompanyOverview: FC<Props> = ({ reviews }) => {
	const { avgRating, ratingLevels } = useMemo(() => {
		if (reviews.length === 0) {
			return {
				avgRating: 0,
				ratingLevels: [0, 0, 0, 0, 0]
			};
		}
		const average = reviews.reduce((acc, { avgRating }) => acc + Number(avgRating), 0) / reviews.length;
		const rating1 = convertToPercentage(
			reviews.filter(({ avgRating }) => Math.round(Number(avgRating) / 2) === 1).length,
			reviews.length
		);
		const rating2 = convertToPercentage(
			reviews.filter(({ avgRating }) => Math.round(Number(avgRating) / 2) === 2).length,
			reviews.length
		);
		const rating3 = convertToPercentage(
			reviews.filter(({ avgRating }) => Math.round(Number(avgRating) / 2) === 3).length,
			reviews.length
		);
		const rating4 = convertToPercentage(
			reviews.filter(({ avgRating }) => Math.round(Number(avgRating) / 2) === 4).length,
			reviews.length
		);
		const rating5 = convertToPercentage(
			reviews.filter(({ avgRating }) => Math.round(Number(avgRating) / 2) === 5).length,
			reviews.length
		);
		return {
			avgRating: Number(average.toFixed(1)),
			ratingLevels: [rating1, rating2, rating3, rating4, rating5]
		};
	}, [reviews]);

	const { interviewProcess, diversity, flexibility, teamCulture, recommendToFriend } = useMemo(() => {
		if (reviews.length === 0) return {};
		const interviewProcess = convertRatingToLevel(
			reviews.reduce((prev, acc) => prev + Number(acc.interviewProcess), 0) / reviews.length
		);
		const diversity = convertRatingToLevel(
			reviews.reduce((prev, acc) => prev + Number(acc.diversity), 0) / reviews.length
		);
		const flexibility = convertRatingToLevel(
			reviews.reduce((prev, acc) => prev + Number(acc.flexibility), 0) / reviews.length
		);
		const teamCulture = convertRatingToLevel(
			reviews.reduce((prev, acc) => prev + Number(acc.teamCulture), 0) / reviews.length
		);
		const recommendToFriend = convertRatingToLevel(
			reviews.reduce((prev, acc) => prev + Number(acc.recommendToFriend), 0) / reviews.length
		);
		return { interviewProcess, diversity, flexibility, teamCulture, recommendToFriend };
	}, [reviews]);

	return (
		<Card className="rounded-none bg-[#EDF5FF] sm:rounded-lg">
			<CardHeader className="pb-0">
				<CardTitle>Overview</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between gap-x-8">
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
					<div className="flex grow flex-col font-semibold italic">
						<span className="text-center text-lg sm:text-xl">Total: {reviews.length}</span>
						<article className="space-y-3">
							{ratingLevels.map((ratingLevel, index) => (
								<div
									key={`rating-${index + 1}`}
									className="flex items-center space-x-3 text-lg sm:text-xl"
								>
									<span>{index + 1}</span>
									<Progress
										rounded={false}
										id={`rating-${index + 1}`}
										value={ratingLevel}
										max={reviews.length}
										className="bg-white"
									/>
									<span className="italic">{ratingLevel}%</span>
								</div>
							))}
						</article>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-y-4 pt-5 font-medium italic">
					<div className="flex flex-col">
						<span>Interview process</span>
						<RatingLabel value={interviewProcess} />
					</div>
					<div className="flex flex-col">
						<span>Diversity</span>
						<RatingLabel value={diversity} />
					</div>
					<div className="flex flex-col">
						<span>Flexibility</span>
						<RatingLabel value={flexibility} />
					</div>
					<div className="flex flex-col">
						<span>Team culture</span>
						<RatingLabel value={teamCulture} />
					</div>
					<div className="col-span-2 flex auto-cols-fr flex-col">
						<span>Recommend to a friend</span>
						<RatingLabel value={recommendToFriend} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

const RatingLabel: FC<{ value: RatingLevel | undefined }> = ({ value }) => {
	return (
		<span
			className={cn("text-sm font-semibold text-black sm:text-base md:text-lg", {
				"text-red-500": value === "Low",
				"text-orange-400": value === "Medium",
				"text-green-500": value === "High",
				"text-blue-500": value === "Super",
				"text-gray-500": value === undefined
			})}
		>
			{value ? value : "N/A"}
		</span>
	);
};

export default CompanyOverview;
