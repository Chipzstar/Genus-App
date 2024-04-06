"use client";

// Small utility to merge class names.
import type { OTPInputProps, SlotProps } from "input-otp";
import { OTPInput as Input } from "input-otp";

import { cn } from "../lib/utils";

const OTPInput = ({ onInput, value, maxLength = 6, render, ...props }: OTPInputProps) => {
	return (
		<Input
			{...props}
			onInput={onInput}
			value={value}
			maxLength={maxLength}
			containerClassName="group flex items-center has-[:disabled]:opacity-30"
			render={render}
		/>
	);
};

// Feel free to copy. Uses @shadcn/ui tailwind colors.
function Slot(props: SlotProps) {
	return (
		<div
			className={cn(
				"relative h-14 w-10 text-[2rem]",
				"flex items-center justify-center",
				"transition-all duration-300",
				"border-y border-r border-border first:rounded-l-md first:border-l last:rounded-r-md",
				"group-focus-within:border-accent-foreground/20 group-hover:border-accent-foreground/20",
				"outline outline-0 outline-accent-foreground/20",
				{ "outline-4 outline-accent-foreground": props.isActive }
			)}
		>
			{props.char !== null && <div>{props.char}</div>}
			{props.hasFakeCaret && <FakeCaret />}
		</div>
	);
}

// You can emulate a fake textbox caret!
function FakeCaret() {
	return (
		<div className="pointer-events-none absolute inset-0 flex animate-caret-blink items-center justify-center">
			<div className="h-8 w-px bg-white" />
		</div>
	);
}

// Inspired by Stripe's MFA input.
function FakeDash() {
	return (
		<div className="flex w-10 items-center justify-center">
			<div className="h-1 w-3 rounded-full bg-border" />
		</div>
	);
}

/*export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}*/

export { OTPInput, Slot, FakeDash, FakeCaret };
