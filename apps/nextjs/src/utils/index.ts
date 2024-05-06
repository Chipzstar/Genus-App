import { format, formatDistance } from "date-fns";
import posthog from "posthog-js";
import { z } from "zod";

import type { careerInterestsSchema } from "@genus/validators";

import type {
	AddTempPasswordInput,
	RatingLevel,
	UserOnboardingStatusInput,
	UserOnboardingStatusOutput
} from "~/utils/types";

export const PATHS = {
	HOME: "/",
	LOGIN: "/login",
	SIGNUP: "/signup",
	FORGOT_PASSWORD: "/reset-password",
	RESET_PASSWORD: "/reset-password",
	INSIGHTS: "/insights",
	COMPANIES: "/companies",
	PROFILE: "/profile",
	NOTIFICATIONS: "/notifications",
	GROUPS: "/groups",
	RESOURCES: "/resources"
};

export type FormatType = "default" | "category";
type StringInput<T> = T extends "category" ? z.infer<typeof careerInterestsSchema> : string | null | undefined;

/**
 * Formats a string based on the specified format type.
 * @param str The input string to be formatted.
 * @param format The format type, either "default" or "category". Defaults to "default".
 * @returns The formatted string.
 */
export function formatString<T extends FormatType = "default">(str: StringInput<T>, format?: T) {
	if (!str) return "";
	if (format === "category" && str === "banking_finance") return "Banking & Finance";
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
export function labelEncode<T extends FormatType = "default">(str: string, format?: T): string {
	if (!str) return "";
	if (format === "category") str = str.replace(/\s&\s/g, "_");
	return str
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/[^\w-]+/g, "")
		.replace(/--+/g, "_")
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
	countMap.forEach((reactions, _) => {
		nestedArray.push(reactions);
	});
	return nestedArray;
}

export function capitalize(str: string | undefined) {
	return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;
}

/**
 * Converts a numeric value to a percentage based on a total value.
 * @param value The numeric value to be converted to a percentage.
 * @param total The total value against which the value is to be converted.
 * @returns The percentage value of the given value with respect to the total value.
 */
export function convertToPercentage(value: number, total: number): number {
	if (total === 0) return 0;
	return Math.round((value / total) * 100);
}

/**
 * Converts a rating value to a level.
 * @param value The rating value to be converted to a level.
 * @returns The level of the given rating value.
 */
export function convertRatingToLevel(value: number): RatingLevel {
	console.log({ value });
	if (value >= 0 && value <= 1) return "Low";
	if (value >= 2 && value <= 3) return "Medium";
	if (value >= 4 && value < 5) return "High";
	return "Super";
}

// LoginSchema definition
const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

// Options for toast
interface ToastOptions {
	description: string;
	closeButton: boolean;
	duration: number;
}

export const handleUserOnboarding = async (
	loginInfo: z.infer<typeof loginSchema>,
	checkOnboarding: (args: UserOnboardingStatusInput) => Promise<UserOnboardingStatusOutput>,
	signOut: () => Promise<void>,
	addTempPassword: (args: AddTempPasswordInput) => any,
	toastInfo: (title: string, args: ToastOptions) => any,
	routerPush: (route: string) => Promise<boolean>
): Promise<boolean> => {
	let step = -1;
	const status = await checkOnboarding({ email: loginInfo.email });

	if (status === "not_started") step = 0;
	else if (status === "background_info") step = 1;
	else if (status === "career_info") step = 2;

	if (step !== -1) {
		addTempPassword({
			email: loginInfo.email,
			password: loginInfo.password
		});
		void signOut().then(() => {
			void routerPush(`${PATHS.SIGNUP}?step=${step}&email=${loginInfo.email}`).then(() => {
				toastInfo("Finish onboarding", {
					description: "We still need to collect some information about you before you can log in.",
					closeButton: true,
					duration: 3000
				});
			});
			posthog.reset();
		});
		return false;
	}
	return true;
};
