import { users } from './users';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const verificationCodes = pgTable('verificationCodes', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  code: text().notNull(),
  expires: timestamp({ mode: 'date' }).notNull(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export type InsertVerificationCodes = typeof verificationCodes.$inferInsert;
export type SelectVerificationCodes = typeof verificationCodes.$inferSelect;

export const insertVerificationCodesSchema = createInsertSchema(verificationCodes);
export const selectVerificationCodesSchema = createSelectSchema(verificationCodes);
