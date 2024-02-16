import React, { FC } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { PATHS } from "~/utils";

interface Props {
	id: string;
	title: string;
	image: string;
}

const InsightCard: FC<Props> = (props: Props) => {
	const { id, title, image } = props;
	return (
		<div className="flex items-center space-x-3 text-black sm:space-x-6 sm:pb-6">
			<object className="mx-auto" type="image/svg+xml" data={image} width={160} />
			{/*<img src={image} alt={title} className="object-fit w-32 sm:w-40" />*/}
			<header className="w-32 grow sm:w-96">
				<span className="whitespace-pre-wrap font-bold leading-tight sm:text-xl">{title}</span>
			</header>
		</div>
	);
};

export default InsightCard;
