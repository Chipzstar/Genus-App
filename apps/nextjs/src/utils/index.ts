import {format} from 'date-fns';

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

export function formatTimestamp(timestamp: Date){
    return format(timestamp.getTime(), 'HH:mm')
}
