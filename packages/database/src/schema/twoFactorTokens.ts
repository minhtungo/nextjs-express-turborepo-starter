import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const twoFactorTokens = pgTable('twoFactorToken', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text().notNull(),
  expires: timestamp({ mode: 'date' }).notNull(),
  email: text().notNull(),
});

export type InsertTwoFactorToken = typeof twoFactorTokens.$inferInsert;
export type SelectTwoFactorToken = typeof twoFactorTokens.$inferSelect;

export const insertTwoFactorTokenSchema = createInsertSchema(twoFactorTokens);
export const selectTwoFactorTokenSchema = createSelectSchema(twoFactorTokens);
