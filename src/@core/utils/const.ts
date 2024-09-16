export const TOKEN_SESSION_TTL = 3 * 60 * 60 * 1000; // <--- ABOUT 3 HOURS
export const TOKEN_REFRESH_TTL = 24 * 60 * 60 * 1000; // <--- ABOUT 3 HOURS
export const VIEW_SESSION_TTL = 24 * 60 * 60 * 1000; // <--- ABOUT 24 HOURS
export const USER_SESSION_PREFIX = 'user:';
export const VIEW_SESSION_PREFIX = 'view-history:';

export const PASSSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}/
