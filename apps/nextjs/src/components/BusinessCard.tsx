import type { FC } from "react";
import React from "react";
import { useRouter } from "next/router";
import { Image } from "@nextui-org/react";

import { PATHS } from "~/utils";
import type { RouterOutputs } from "~/utils/trpc";

export const BusinessCard: FC<{ business: RouterOutputs["business"]["getAll"][number] }> = props => {
	const { name, logoUrl, tags, slug } = props.business;
	const router = useRouter();
	return (
		<div
			onClick={() => router.push(`${PATHS.BUSINESS}/${slug}`)}
			role="button"
			className="relative h-40 w-40 overflow-hidden"
			style={{
				borderRadius: "35px"
			}}
		>
			<Image src={logoUrl ?? "/images/logo.png"} width="100%" />
			<div
				className="absolute bottom-0 z-10 flex h-14 w-full flex-col bg-gray-400/50 px-3 pt-2 text-white"
				style={{
					borderRadius: "0 0 35px 35px"
				}}
			>
				<span>{name}</span>
				<div className="flex flex-wrap text-wrap">
					{tags.map((tag, index) => (
						<span key={index} className="inline-block rounded-full text-xs font-semibold tracking-tight">
							#{tag}&nbsp;
						</span>
					))}
				</div>
			</div>
		</div>
	);
};
