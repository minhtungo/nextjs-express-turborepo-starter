import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { sessions } from './sessions';

export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);

export type InsertSession = typeof sessions.$inferInsert;
export type Session = typeof sessions.$inferSelect;
