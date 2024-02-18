import { format, formatDistance } from "date-fns";

import type { Reaction } from "@genus/db";

import type { InsightPanel } from "~/utils/types";

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
export function formatString(str: string | undefined) {
	if (!str) return "";
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

export function formatTimestamp(timestamp: Date, method = "default") {
	switch (method) {
		case "distance":
			return formatDistance(timestamp, Date.now(), {
				addSuffix: true
			});
		default:
			return format(timestamp.getTime(), "HH:mm");
	}
}

export const INSIGHTS: InsightPanel[] = [
	{
		slug: "tobi-markets-analyst-at-goldman-sachs",
		title: "Tobi - Markets Analyst at Goldman Sachs",
		image: "/images/experts/Tobi.svg"
	},
	{
		slug: "joseph-investment-banking-analyst-at-leading-boutique-firm",
		title: "Joseph - Investment Banking Analyst at Leading Boutique firm",
		image: "/images/experts/Joseph.svg"
	},
	{
		slug: "sheila-research-analyst-at-barclays",
		title: "Sheila - Research Analyst at Barclays",
		image: "/images/experts/Sheila.svg"
	},
	{
		slug: "dolly-trader-at-jp-morgan",
		title: "Dolly - Trader at JP Morgan",
		image: "/images/experts/Dolly.svg"
	}
];

export function convertToNestedArray(arr: Reaction[] = []) {
	// Use a Map to count the occurrences of each unique string
	const countMap = new Map<string, Reaction[]>();
	// Count occurrences
	for (const [i, r] of arr.entries()) {
		const reactions = countMap.get(r.emoji) ?? [];
		reactions.push(r);
		countMap.set(r.emoji, reactions);
	}
	// Initialize the nested array
	const nestedArray: Reaction[][] = [];
	// Create the nested array with unique items and their counts
	countMap.forEach((reactions, value) => {
		nestedArray.push(reactions);
	});
	return nestedArray;
}

export function capitalize(str: string | undefined) {
	return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;
}
