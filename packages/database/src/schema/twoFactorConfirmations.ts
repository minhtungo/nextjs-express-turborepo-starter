import { users } from './users';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const twoFactorConfirmations = pgTable('twoFactorConfirmation', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export type InsertTwoFactorConfirmation = typeof twoFactorConfirmations.$inferInsert;
export type SelectTwoFactorConfirmation = typeof twoFactorConfirmations.$inferSelect;

export const insertTwoFactorConfirmationSchema = createInsertSchema(twoFactorConfirmations);
export const selectTwoFactorConfirmationSchema = createSelectSchema(twoFactorConfirmations);
