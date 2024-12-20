import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    WEBAPP_URL: z.string().url(),
    SERVER_URL: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});
