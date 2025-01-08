import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { twoFactorConfirmations } from './twoFactorConfirmations';

export const insertTwoFactorConfirmationSchema = createInsertSchema(twoFactorConfirmations);
export const selectTwoFactorConfirmationSchema = createSelectSchema(twoFactorConfirmations);

export type InsertTwoFactorConfirmation = typeof twoFactorConfirmations.$inferInsert;
export type TwoFactorConfirmation = typeof twoFactorConfirmations.$inferSelect;
