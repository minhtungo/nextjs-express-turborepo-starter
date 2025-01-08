import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { resetPasswordTokens } from './resetPasswordTokens';

export const insertResetPasswordTokenSchema = createInsertSchema(resetPasswordTokens);
export const selectResetPasswordTokenSchema = createSelectSchema(resetPasswordTokens);

export type InsertResetPasswordToken = typeof resetPasswordTokens.$inferInsert;
export type ResetPasswordToken = typeof resetPasswordTokens.$inferSelect;
