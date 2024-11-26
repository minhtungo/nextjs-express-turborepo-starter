import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable('user', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text(),
  email: text().notNull(),
  password: text(),
  emailVerified: timestamp({ mode: 'date' }),
  image: text(),
  role: varchar({ enum: ['user', 'admin'] }).default('user'),
  plan: varchar({ enum: ['free', 'pro'] }).default('free'),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
