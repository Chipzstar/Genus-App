import {Button} from "@genus/ui/button";
import React from "react";

export function LogoutButton(props: { onClick: (e: React.MouseEvent<HTMLButtonElement>) => any }) {
    return <div className="right-5 px-4 self-end">
        <Button size="sm" onClick={props.onClick}>Logout</Button>
    </div>;
}
