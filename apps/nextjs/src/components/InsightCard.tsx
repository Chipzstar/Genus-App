import type { FC } from "react";
import React from "react";

interface Props {
	id: string;
	title: string;
	image: string;
}

const InsightCard: FC<Props> = (props: Props) => {
	const { title, image } = props;

	return (
		<div className="flex items-center space-x-3 pb-6 text-black sm:space-x-6">
			<img src={image} alt={title} className="object-fit w-32 sm:w-40" />
			<header className="w-32 grow sm:w-96">
				<span className="whitespace-pre-wrap font-semibold leading-tight tracking-tight sm:text-xl sm:font-bold">
					{title}
				</span>
			</header>
		</div>
	);
};

export default InsightCard;
