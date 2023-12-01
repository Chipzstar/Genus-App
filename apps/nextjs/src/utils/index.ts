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
        .replace(/\b\w/g, l => l.toUpperCase());
}

