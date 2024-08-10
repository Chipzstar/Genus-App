import React from "react";
import { useRouter } from "next/router";
import { Image } from "@nextui-org/react";

export function BackButton() {
	const router = useRouter();
	return (
		<div role="button" onClick={router.back}>
			<Image src="/static/back-arrow.svg" className="h-6 sm:h-10" />
		</div>
	);
}
