import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    PORT: z.string().optional(),
    NODE_ENV: z.string().optional(),
    SERVER_URL: z.string(),
    SESSION_SECRET_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_API_URL,
    SERVER_URL: process.env.SERVER_URL,
    SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
  },
});
