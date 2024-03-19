import React, { FC } from "react";

interface Props {
	id: string;
	title: string;
	image: string;
}

const InsightCard: FC<Props> = (props: Props) => {
	const { id, title, image } = props;

	return (
		<div className="flex items-center space-x-3 text-black sm:space-x-6 pb-6">
			{/*<object
				className="mx-auto w-28 overflow-visible sm:w-40"
				type="image/svg+xml"
				data={image}
				width={175}
				height={100}
			/>*/}
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
