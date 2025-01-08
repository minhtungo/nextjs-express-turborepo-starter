import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { verificationTokens } from './verificationTokens';

export const insertVerificationTokenSchema = createInsertSchema(verificationTokens);
export const selectVerificationTokenSchema = createSelectSchema(verificationTokens);

export type InsertVerificationToken = typeof verificationTokens.$inferInsert;
export type VerificationToken = typeof verificationTokens.$inferSelect;
