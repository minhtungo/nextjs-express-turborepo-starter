export const APP_CONSTANTS = {
  name: 'Your App Name',
  description: 'Your app description',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr'] as const,
  url: process.env.WEBAPP_URL,
} as const;

export const AUTH_CONSTANTS = {
  sessionCookie: {
    name: 'session',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    renewThreshold: 1000 * 60 * 60 * 24 * 3, // 3 days
  },
} as const;

export const RATE_LIMIT_CONSTANTS = {
  defaultWindow: 15 * 60 * 1000, // 15 minutes
  defaultMax: 100, // limit each IP to 100 requests per window
  auth: {
    window: 60 * 1000, // 1 minute
    max: 5, // 5 attempts per minute
  },
} as const;

export const API_CONSTANTS = {
  defaultPageSize: 10,
  maxPageSize: 100,
  defaultSort: 'createdAt',
  defaultOrder: 'desc' as const,
} as const;
