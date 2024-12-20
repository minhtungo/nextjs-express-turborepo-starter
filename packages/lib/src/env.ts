import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    WEBAPP_URL: z.string().url(),

    // Server
    SERVER_URL: z.string().url(),

    // Database
    DATABASE_URL: z.string().min(1),
  },

  runtimeEnv: process.env,
});
