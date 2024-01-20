import {Reaction} from '@genus/db';
import {format, formatDistance} from 'date-fns';

export const PATHS = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    INSIGHTS: '/insights',
    PROFILE: '/profile',
    NOTIFICATIONS: '/notifications',
    GROUPS: '/groups',
}

export function formatString(str: string): string {
    return str
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/'(\w)/g, (_, letter) => "'" + letter.toLowerCase());
}

/**
 * Sanitizes a string by converting it to lowercase and replacing spaces with hyphens.
 * @param str
 */
export function labelEncode(str: string): string {
    return str
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatTimestamp(timestamp: Date, method: string = "default") {
    switch (method) {
        case 'distance':
            return formatDistance(timestamp, Date.now(), {
                addSuffix: true
            })
        default:
            return format(timestamp.getTime(), 'HH:mm')
    }
}

export const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
];

export function convertToNestedArray(arr: Reaction[] = []) {
    // Use a Map to count the occurrences of each unique string
    let countMap = new Map<String, Reaction[]>();
    // Count occurrences
    for (let [i, r] of arr.entries()) {
        let reactions = countMap.get(r.emoji) || [];
        reactions.push(r)
        countMap.set(r.emoji, reactions);
    }
    // Initialize the nested array
    let nestedArray: Reaction[][] = [];
    // Create the nested array with unique items and their counts
    countMap.forEach((reactions, value) => {
        nestedArray.push(reactions);
    });
    return nestedArray;
}
