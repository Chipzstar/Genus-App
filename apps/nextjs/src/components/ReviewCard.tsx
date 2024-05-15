import type { FC } from "react";
import React from "react";
import { Image } from "@nextui-org/react";
import { Check, MapPin } from "lucide-react";

import { cn } from "@genus/ui";
import { Ratings } from "@genus/ui/rating";

import { formatString } from "~/utils";
import type { CompanyReview } from "~/utils/types";

interface Props {
	id: string;
	company: string;
	review: CompanyReview;
}

const ReviewCard: FC<Props> = ({ review, company }) => {
	return (
		<div className="flex w-full shrink flex-col gap-x-3 gap-y-2 text-black sm:gap-x-6">
			<section className="grid grid-cols-9 place-items-center gap-3">
				<span className="text-xl font-semibold italic sm:text-2xl">{Number(review.avgRating) / 2}</span>
				<div className="col-span-8 flex h-full w-full items-center">
					<Ratings size={20} rating={Math.round(Number(review.avgRating) / 2)} />
				</div>
				<div className="h-10 w-10">
					<Image src="/images/avatar-placeholder-2.svg" alt="person-placeholder" />
				</div>
				<div className="col-span-8 flex w-full flex-col space-y-1 text-wrap">
					<span className="text-lg font-semibold">
						{company} {formatString(review.division)}
					</span>
					<div className="flex items-center">
						<span className="grow font-semibold">{review.completionYear}</span>
						<div className="flex grow items-center">
							<MapPin color="gray" className="mr-1" />
							<span className="font-semibold">{review.region}</span>
						</div>
						<div className="flex grow items-center">
							<Check color="#68E010" className="mr-1" />
							<span
								className={cn("font-semibold", {
									"text-success": review.isConverter
								})}
							>
								{review.isConverter ? "Successfully converted" : "Non converter"}
							</span>
						</div>
					</div>
				</div>
			</section>
			<section className="grid grid-cols-2 gap-x-8 gap-y-4">
				<div className="flex flex-col">
					<span className="font-semibold text-success">Pros</span>
					<ul className="text-sm">
						{review.pros.length ? (
							review.pros.map((pro, index) => <li key={index}>{pro}</li>)
						) : (
							<li>None specified</li>
						)}
					</ul>
				</div>
				<div className="row-span-2 flex flex-col">
					<span className="font-semibold text-gray-900">Top work skills</span>
					<ul className="list-inside list-disc text-sm">
						{review.topSkills.length ? (
							review.topSkills.map((skill, index) => <li key={index}>{skill}</li>)
						) : (
							<li>None specified</li>
						)}
					</ul>
				</div>
				<div>
					<span className="font-semibold text-red-500">Cons</span>
					<ul className="text-sm">
						{review.cons.length ? (
							review.cons.map((con, index) => <li key={index}>{con}</li>)
						) : (
							<li>None specified</li>
						)}
					</ul>
				</div>
			</section>
		</div>
	);
};

export default ReviewCard;
