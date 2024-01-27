import React from "react";

import { Button } from "@genus/ui/button";

interface Props {
	title: string;
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	textSize?: string;
}

export function GroupStatusButton({ onClick, title, textSize = "text-lg" }: Props) {
	return (
		<div className="right-5 self-end">
			<Button className={"w-24 rounded-3xl px-3 font-semibold" + textSize} size="sm" onClick={onClick}>
				{title}
			</Button>
		</div>
	);
}
