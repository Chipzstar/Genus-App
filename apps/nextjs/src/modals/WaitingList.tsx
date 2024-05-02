import type { FC } from "react";
import React from "react";

import { Button } from "@genus/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@genus/ui/dialog";

interface Props {
	open: boolean;
	onClose: () => void;
}

const WaitingList: FC<Props> = ({ open, onClose }) => {
	return (
		<Dialog open={open} onOpenChange={() => onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="gap-y-4">
					<DialogTitle>Thanks for joining! 🎉</DialogTitle>
					<DialogDescription className="space-y-2 text-gray-500">
						<p>{"We're so excited to have you on board! You'll be the first to know when we go live 🚀"}</p>
						<p>Keep an eye on your inbox!</p>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="ghost" onClick={onClose} className="px-8">
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default WaitingList;
