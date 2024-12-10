import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    WEB_URL: z.string().url(),

    // Server
    API_URL: z.string().url().optional(),

    // Database
    DATABASE_URL: z.string().min(1),

    // Services
    REDIS_URL: z.string().url().optional(),
    S3_BUCKET: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_REGION: z.string().optional(),
  },

  runtimeEnv: process.env,
});
