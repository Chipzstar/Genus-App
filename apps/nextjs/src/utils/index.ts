import { format, formatDistance } from "date-fns";
import { z } from "zod";

import type { UserOnboardingStatus } from "~/utils/types";

export const PATHS = {
	HOME: "/",
	LOGIN: "/login",
	SIGNUP: "/signup",
	FORGOT_PASSWORD: "/reset-password",
	RESET_PASSWORD: "/reset-password",
	INSIGHTS: "/insights",
	PROFILE: "/profile",
	NOTIFICATIONS: "/notifications",
	GROUPS: "/groups"
};

/**
 * Replaces underscores, two underscores, and converts the first character of each word to uppercase, handling commas
 * correctly.
 * @param str the string to format
 */
export function formatString(str: string | null | undefined) {
	if (!str) return "";
	if (str.length <= 2) return str.toUpperCase();
	return str
		.replace(/__/g, ", ") // replace two underscores with comma followed by a space
		.replace(/[_-]/g, " ") // replace underscore with a space
		.replace(/\b\w/g, l => l.toUpperCase()) // convert the first character of each word to uppercase
		.replace(/'(\w)/g, (_, letter) => "'" + letter.toLowerCase()); // handle special case for apostrophe
}

/**
 * Sanitizes a string by converting it to lowercase and replacing spaces with hyphens.
 * @param str
 */
export function labelEncode(str: string): string {
	return str
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]+/g, "")
		.replace(/--+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
}

export function timeout(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatTimestamp(timestamp: string | Date, method = "default") {
	switch (method) {
		case "distance":
			return formatDistance(new Date(timestamp), Date.now(), {
				addSuffix: true
			});
		default:
			return format(new Date(timestamp).getTime(), "HH:mm");
	}
}

export function convertToNestedArray(arr: any[] = []) {
	// Use a Map to count the occurrences of each unique string
	const countMap = new Map<string, any[]>();
	// Count occurrences
	for (const [i, r] of arr.entries()) {
		const reactions = countMap.get(r.emoji) ?? [];
		reactions.push(r);
		countMap.set(r.emoji, reactions);
	}
	// Initialize the nested array
	const nestedArray: any[][] = [];
	// Create the nested array with unique items and their counts
	countMap.forEach((reactions, value) => {
		nestedArray.push(reactions);
	});
	return nestedArray;
}

export function capitalize(str: string | undefined) {
	return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;
}

// LoginSchema definition
const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

// Your function types
type CheckOnboardingFunction = (args: { email: string }) => Promise<UserOnboardingStatus>;
type SignOutFunction = () => Promise<void>;
type AddTempPasswordFunction = (args: { email: string; password: string }) => any;
type ToastInfoFunction = (title: string, args: ToastOptions) => any;
type RouterPushFunction = (route: string) => Promise<boolean>;

// Options for toast
interface ToastOptions {
	description: string;
	closeButton: boolean;
	duration: number;
}

export const handleUserOnboarding = async (
	loginInfo: z.infer<typeof loginSchema>,
	checkOnboardingFunction: CheckOnboardingFunction,
	signOutFunction: SignOutFunction,
	addTempPasswordFunction: AddTempPasswordFunction,
	toastInfoFunction: ToastInfoFunction,
	routerPushFunction: RouterPushFunction
): Promise<boolean> => {
	let step = -1;
	const status = await checkOnboardingFunction({ email: loginInfo.email });

	if (status === "not_started") step = 0;
	else if (status === "background_info") step = 1;
	else if (status === "career_info") step = 2;

	if (step !== -1) {
		await signOutFunction();
		addTempPasswordFunction({
			email: loginInfo.email,
			password: loginInfo.password
		});

		void routerPushFunction(`${PATHS.SIGNUP}?step=${step}&email=${loginInfo.email}`).then(() => {
			toastInfoFunction("Finish onboarding", {
				description: "We still need to collect some information about you before you can log in.",
				closeButton: true,
				duration: 3000
			});
		});

		return false;
	}

	return true;
};
