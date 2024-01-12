import {Button} from "@genus/ui/button";
import React from "react";

interface Props {
    title: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => any;
    textSize?: string;
}

export function GroupStatusButton({onClick, title, textSize = "text-lg"}: Props) {
    return <div className="right-5 self-end">
        <Button className={"rounded-3xl font-semibold w-24 px-3" + textSize} size="sm" onClick={onClick}>{title}</Button>
    </div>;
}
