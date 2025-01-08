import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  email: text().notNull(),
  password: text(),
  emailVerified: timestamp({ mode: 'date' }),
  image: text(),
  plan: varchar({ enum: ['free', 'pro'] }).default('free'),
});
