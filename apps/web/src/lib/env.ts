import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    BASE_URL: z.string().url(),
    EXTERNAL_SERVER_URL: z.string().min(1),

    SESSION_COOKIE_NAME: z.string().min(1),
    SESSION_COOKIE_MAX_AGE: z.coerce.number().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_EXTERNAL_SERVER_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_EXTERNAL_SERVER_URL: process.env.NEXT_PUBLIC_EXTERNAL_SERVER_URL,
    ...process.env,
  },
});
