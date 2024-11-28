import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    PORT: z.string().optional(),
    NODE_ENV: z.string().optional(),
    SERVER_BASE_URL: z.string(),
    SITE_BASE_URL: z.string(),
    SESSION_SECRET_KEY: z.string(),
  },
  runtimeEnv: process.env,
});
