import { users } from './users';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const resetPasswordTokens = pgTable('resetPasswordToken', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text().notNull(),
  expires: timestamp({ mode: 'date' }).notNull(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export type InsertResetPasswordToken = typeof resetPasswordTokens.$inferInsert;
export type SelectResetPasswordToken = typeof resetPasswordTokens.$inferSelect;

export const insertResetPasswordTokenSchema = createInsertSchema(resetPasswordTokens);
export const selectResetPasswordTokenSchema = createSelectSchema(resetPasswordTokens);
