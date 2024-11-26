import * as schema from '@repo/database/schema';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
  schema,
});
