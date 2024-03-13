import { format, formatDistance } from "date-fns";

export const CAREER_INTERESTS = {
	banking_finance: 1,
	law: 2,
	consulting: 3,
	tech: 4
};

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
